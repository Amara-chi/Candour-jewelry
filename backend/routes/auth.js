import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  forgotPassword,
  googleAuth,
  googleCallback
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/google', googleAuth);

export default router;
