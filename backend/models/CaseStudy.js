const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: [
      {
        iconName: { type: String, default: 'TrendingUp' },
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    quote: { type: String },
    author: { type: String },
    tag: { type: String, default: 'Case Study' },
    color: { type: String, default: '#818cf8' },
    coverImage: { type: String, default: '/product1.jpeg' },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CaseStudy', caseStudySchema);
