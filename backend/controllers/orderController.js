import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAdminOrderNotification
} from '../utils/emailService.js';

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, shippingEmail, paymentMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items,
      totalAmount: cart.totalPrice,
      shippingAddress,
      shippingEmail: shippingEmail || req.user.email,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    await order.populate('items.product', 'name price');

    const orderDetails = {
      orderId: order._id,
      items: order.items,
      totalPrice: order.totalAmount,
      shippingAddress: [
        shippingAddress?.street,
        shippingAddress?.city,
        shippingAddress?.state,
        shippingAddress?.zipCode,
        shippingAddress?.country
      ].filter(Boolean).join(', '),
      customerName: req.user?.name,
      customerEmail: order.shippingEmail
    };

    // Send confirmation email
    try {
      await sendOrderConfirmation(order.shippingEmail, orderDetails);
      await sendAdminOrderNotification(orderDetails, order.status);
    } catch (emailError) {
      console.log('Email failed, but order created:', emailError.message);
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price')
      .sort('-createdAt');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderDetails = {
      orderId: order._id,
      items: order.items,
      totalPrice: order.totalAmount,
      customerName: order.user?.name,
      customerEmail: order.shippingEmail
    };

    // Send status update email
    try {
      await sendOrderStatusUpdate(order.shippingEmail, orderDetails, status);
      await sendAdminOrderNotification(orderDetails, status);
    } catch (emailError) {
      console.log('Status email failed:', emailError.message);
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
