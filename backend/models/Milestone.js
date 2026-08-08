const mongoose = require('mongoose');

const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 160,
    },
    description: { type: String, trim: true, maxlength: 2000 },
    dueDate: Date,
    status: {
      type: String,
      enum: MILESTONE_STATUSES,
      default: 'pending',
    },
    // Display order within a project.
    order: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

// Stamp completedAt when status flips to/from completed.
milestoneSchema.pre('save', function stampCompletion(next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completed' ? new Date() : undefined;
  }
  if (typeof next === 'function') next();
});

milestoneSchema.statics.STATUSES = MILESTONE_STATUSES;

module.exports = mongoose.model('Milestone', milestoneSchema);
