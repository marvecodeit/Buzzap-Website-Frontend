const mongoose = require('mongoose');

const PROJECT_STATUSES = ['planning', 'in-progress', 'review', 'completed', 'on-hold'];
const SERVICE_TYPES = [
  'ai-marketing',
  'brand-seo',
  'crm-automation',
  'ai-agents',
  'content-strategy',
  'growth-consulting',
  'other',
];

// Turn a title into a URL-safe slug fragment.
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 160,
    },
    slug: { type: String, unique: true, index: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'A client (lead) is required'],
      index: true,
    },
    serviceType: {
      type: String,
      enum: SERVICE_TYPES,
      default: 'other',
    },
    description: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'planning',
      index: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: Date,
    dueDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Generate a unique slug from the title before validation.
// Appends a short random suffix so titles can repeat across clients.
projectSchema.pre('validate', async function generateSlug(next) {
  if (this.slug && !this.isModified('title')) {
    if (typeof next === 'function') next();
    return;
  }
  const base = slugify(this.title || '') || 'project';
  let candidate = base;
  let n = 0;
  // Loop until we find a free slug (bounded — the counter guarantees termination).
  while (await mongoose.models.Project.exists({ slug: candidate, _id: { $ne: this._id } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  this.slug = candidate;
  if (typeof next === 'function') next();
});

projectSchema.statics.STATUSES = PROJECT_STATUSES;
projectSchema.statics.SERVICE_TYPES = SERVICE_TYPES;

module.exports = mongoose.model('Project', projectSchema);
