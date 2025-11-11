import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', protect, authorize('admin'), upload.array('images', 10), createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.delete('/:id/images/:imageId', protect, authorize('admin'), deleteProductImage);

// Search route
router.get('/search', getProducts); // Reuse getProducts with search param

// Related products route
router.get('/:id/related', async (req, res) => {
  try {
    // Implementation for related products
    const product = await Product.findById(req.params.id);
    const relatedProducts = await Product.find({
      categories: { $in: product.categories },
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4);
    
    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;