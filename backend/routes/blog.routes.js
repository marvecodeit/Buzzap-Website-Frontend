const express = require('express');

const validateModule = require('../middleware/validate');
const validate = validateModule.validate;
const validateQuery = validateModule.validateQuery;
const { protect, requireRole } = require('../middleware/auth');
const { singleFile } = require('../middleware/upload');
const ctrl = require('../controllers/blog.controller');
const { createPostSchema, updatePostSchema, listPostsSchema } = require('../validators/blog.validators');

const router = express.Router();

const managers = [protect, requireRole('staff', 'admin')];

// --- Admin (defined before /:slug so "admin" isn't treated as a slug) ---
router.get('/admin/all', ...managers, ctrl.listAll);
router.post('/upload-image', ...managers, singleFile, ctrl.uploadImage);
router.post('/', ...managers, validate(createPostSchema), ctrl.createPost);
router.patch('/:id', ...managers, validate(updatePostSchema), ctrl.updatePost);
router.delete('/:id', ...managers, ctrl.deletePost);

// --- Public ---
router.get('/', validateQuery(listPostsSchema), ctrl.listPublished);
router.get('/:slug', ctrl.getBySlug);
router.post('/:id/react', ctrl.reactToPost);
router.post('/:id/comments', ctrl.addComment);
router.post('/:id/comments/:commentId/like', ctrl.likeComment);

module.exports = router;
