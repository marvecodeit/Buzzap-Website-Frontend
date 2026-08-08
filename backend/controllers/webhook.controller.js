const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const { notify } = require('../utils/notify');
const { sendMail } = require('../email/mailer');
const config = require('../config/env');

// POST /api/webhooks/calcom (public webhook listener)
const handleCalcomWebhook = asyncHandler(async (req, res) => {
  const event = req.body || {};
  const triggerEvent = event.triggerEvent || event.event;

  logger.info(`Cal.com webhook received: ${triggerEvent || 'Unknown event'}`);

  if (['BOOKING_CREATED', 'BOOKING_RESCHEDULED'].includes(triggerEvent)) {
    const payload = event.payload || {};
    const attendee = (payload.attendees && payload.attendees[0]) || {};
    const name = attendee.name || payload.title || 'Cal.com Booking';
    const email = attendee.email || payload.email;

    if (email) {
      const notes = `Booking: ${payload.title || 'Call'} at ${payload.startTime || 'Scheduled Time'}. Meeting Link: ${payload.videoCallUrl || 'N/A'}`;
      let lead = await Lead.findOne({ email });

      if (lead) {
        lead.status = 'qualified';
        lead.source = 'booking';
        lead.note = lead.note ? `${lead.note}\n${notes}` : notes;
        await lead.save();
      } else {
        lead = await Lead.create({
          name,
          email,
          phone: attendee.timeZone || '',
          source: 'booking',
          status: 'qualified',
          note: notes,
          message: `Booked strategy call via Cal.com: ${payload.title || ''}`,
        });
      }

      // Trigger staff notifications
      notify({
        type: 'lead_created',
        title: 'Strategy Call Booked!',
        message: `${name} (${email}) booked a call via Cal.com`,
        link: '/dashboard/leads',
      }).catch(() => {});

      const notifyTo = config.LEADS_NOTIFY_EMAIL || config.SMTP_USER;
      if (notifyTo) {
        sendMail({
          to: notifyTo,
          subject: `📅 Strategy Call Booked: ${name}`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
            <h2>📅 New Strategy Call Booked!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Event:</strong> ${payload.title || 'Strategy Call'}</p>
            <p><strong>Time:</strong> ${payload.startTime || 'Scheduled'}</p>
            <p><strong>Link:</strong> <a href="${payload.videoCallUrl || '#'}">${payload.videoCallUrl || 'View in Cal.com'}</a></p>
          </div>`,
        }).catch((e) => logger.error(`Email send error: ${e.message}`));
      }
    }
  }

  res.status(200).json({ status: 'success', received: true });
});

module.exports = { handleCalcomWebhook };
