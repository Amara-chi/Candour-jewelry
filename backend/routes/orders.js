import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// User routes
router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrder);

// Admin routes
router.route('/admin/all')
  .get(getAllOrders);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
