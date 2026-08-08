const mongoose = require('mongoose');

// A file uploaded to a project (deliverable, brief, reference, etc.).
const assetSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: { type: String, required: true, trim: true, maxlength: 260 },
    // Cloudinary public_id (needed to delete/transform later).
    cloudinaryId: { type: String, required: true },
    url: { type: String, required: true },
    bytes: { type: Number, default: 0 },
    mimeType: { type: String, trim: true },
    // Cloudinary resource type: 'image' | 'video' | 'raw'.
    resourceType: { type: String, default: 'raw' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
