import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  reviewerName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;