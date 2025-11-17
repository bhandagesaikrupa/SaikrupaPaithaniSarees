import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews with filtering
router.get('/', async (req, res) => {
  try {
    const { status, productId } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (productId) {
      filter.productId = productId;
    }
    
    const reviews = await Review.find(filter)
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ 
      productId, 
      status: 'approved' 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product reviews'
    });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { productId, reviewerName, rating, reviewText } = req.body;
    
    // Validate required fields
    if (!productId || !reviewerName || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Create new review
    const review = new Review({
      productId,
      reviewerName,
      rating,
      reviewText,
      status: 'pending' // Default status - requires admin approval
    });
    
    await review.save();
    
    // Populate product info for response
    await review.populate('productId', 'name images');
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and awaiting approval',
      review
    });
    
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
});

// Update review status (approve/reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('productId', 'name images');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: `Review ${status} successfully`,
      review
    });
    
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review status'
    });
  }
});

// Update review content (admin edit)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerName, rating, reviewText } = req.body;
    
    // Validate required fields
    if (!reviewerName || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      {
        reviewerName,
        rating,
        reviewText,
        adminEdited: true,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('productId', 'name images');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
    
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});


// Add this route to your existing reviewRoutes.js
router.get('/product/:productId/all', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ productId })
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get all product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product reviews'
    });
  }
});
export default router;