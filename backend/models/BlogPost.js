const mongoose = require('mongoose');

// Generate a URL slug from a title.
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 500 },
    content: { type: String, required: [true, 'Content is required'] },
    coverImage: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    published: { type: Boolean, default: false, index: true },
    publishedAt: Date,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      insightful: { type: Number, default: 0 },
      celebrate: { type: Number, default: 0 },
      mindblown: { type: Number, default: 0 },
    },
    comments: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        authorName: { type: String, required: true, trim: true },
        authorAvatar: { type: String, default: '' },
        content: { type: String, required: true, trim: true },
        likes: { type: Number, default: 0 },
        parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Keep slug in sync with title; stamp publishedAt when first published.
blogPostSchema.pre('save', function preSave(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title || '');
  }
  if (this.isModified('published')) {
    this.publishedAt = this.published ? this.publishedAt || new Date() : undefined;
  }
  if (typeof next === 'function') next();
});

blogPostSchema.statics.slugify = slugify;

module.exports = mongoose.model('BlogPost', blogPostSchema);
