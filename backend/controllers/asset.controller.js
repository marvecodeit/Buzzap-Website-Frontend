const mongoose = require('mongoose');
const Asset = require('../models/Asset');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { cloudinary, isConfigured } = require('../config/cloudinary');
const { notify } = require('../utils/notify');

// Stream an in-memory buffer to Cloudinary, resolving with the upload result.
function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// POST /api/projects/:id/assets  (multipart, field "file")
const uploadAsset = asyncHandler(async (req, res) => {
  if (!isConfigured()) {
    throw new ApiError(503, 'File storage is not configured (CLOUDINARY_URL missing).');
  }
  if (!req.file) throw ApiError.badRequest('No file provided (expected field "file")');

  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  const result = await uploadBuffer(req.file.buffer, {
    folder: `buzzaphq/projects/${project._id}`,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
  });

  const asset = await Asset.create({
    project: project._id,
    uploadedBy: req.user._id,
    filename: req.file.originalname,
    cloudinaryId: result.public_id,
    url: result.secure_url,
    bytes: result.bytes,
    mimeType: req.file.mimetype,
    resourceType: result.resource_type,
  });

  // Notify the admins/staff (best-effort) that a file landed.
  notify({
    type: 'file_uploaded',
    title: 'File uploaded',
    message: `${req.file.originalname} was added to "${project.title}"`,
    link: `/dashboard/projects/${project._id}`,
    email: true,
  }).catch(() => {});

  res.status(201).json({ status: 'success', asset });
});

// GET /api/projects/:id/assets
const listAssets = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.notFound('Project not found');
  const assets = await Asset.find({ project: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: assets.length, assets });
});

// DELETE /api/projects/:id/assets/:assetId
const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({
    _id: mongoose.isValidObjectId(req.params.assetId) ? req.params.assetId : null,
    project: req.params.id,
  });
  if (!asset) throw ApiError.notFound('Asset not found');

  // Remove from Cloudinary first; ignore "not found" so DB stays consistent.
  if (isConfigured()) {
    try {
      await cloudinary.uploader.destroy(asset.cloudinaryId, { resource_type: asset.resourceType });
    } catch {
      /* best-effort; proceed to remove the DB record */
    }
  }

  await asset.deleteOne();
  res.status(204).send();
});

module.exports = { uploadAsset, listAssets, deleteAsset };
