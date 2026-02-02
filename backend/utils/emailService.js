import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

const initializeEmailService = () => {
  if (transporter) return transporter;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_PASSWORD;

  if (!gmailUser || !gmailPassword) {
    console.warn('Gmail credentials not configured. Email service will not work.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });

  return transporter;
};

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailTransporter = initializeEmailService();

    if (!mailTransporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: `"Candour Jewelry" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

const formatOrderItems = (items = []) => items.map((item) => {
  const name = item.productName || item.product?.name || 'Item';
  const price = item.price ?? item.product?.price ?? 0;
  return {
    name,
    quantity: item.quantity,
    price
  };
});

const getAdminRecipients = () => {
  const configured = process.env.ADMIN_EMAILS
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  if (configured && configured.length > 0) {
    return configured;
  }
  return process.env.GMAIL_USER ? [process.env.GMAIL_USER] : [];
};

const getStatusCopy = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'pending':
      return {
        title: 'Order Received',
        message: 'We have received your order and will begin processing it shortly.'
      };
    case 'confirmed':
      return {
        title: 'Order Processed',
        message: 'Good news! Your order has been confirmed and is being prepared for shipment.'
      };
    case 'shipped':
      return {
        title: 'Order Shipped',
        message: 'Your order is on its way! Keep an eye out for delivery updates.'
      };
    case 'delivered':
      return {
        title: 'Order Delivered',
        message: 'We hope you love your jewelry! Your order has been delivered.'
      };
    case 'cancelled':
      return {
        title: 'Order Cancelled',
        message: 'Your order has been cancelled. If you have questions, please contact us.'
      };
    default:
      return {
        title: 'Order Update',
        message: `Your order status is now: ${status}.`
      };
  }
};

export const sendOrderConfirmation = async (email, orderDetails) => {
  const items = formatOrderItems(orderDetails.items);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #B8860B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; color: #B8860B; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Thank you for your order! We're excited to prepare your beautiful jewelry pieces.</p>

          <div class="order-details">
            <h3>Order Number: ${orderDetails.orderId}</h3>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
          </div>

          <div class="order-details">
            <h3>Order Items:</h3>
            ${items.map(item => `
              <div class="product-item">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
                <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `).join('')}
            <div class="total">
              Total: $${orderDetails.totalPrice.toFixed(2)}
            </div>
          </div>

          <div class="order-details">
            <h3>Shipping Address:</h3>
            <p>${orderDetails.shippingAddress}</p>
          </div>

          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Candour Jewelry. All rights reserved.</p>
          <p>Email: info@candourjewelry.com | Phone: +1-800-JEWELRY</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Order Confirmation - Candour Jewelry', htmlContent);
};

export const sendOrderStatusUpdate = async (email, orderDetails, status) => {
  const statusCopy = getStatusCopy(status);
  const items = formatOrderItems(orderDetails.items);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #B8860B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .status { font-size: 18px; font-weight: bold; color: #B8860B; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusCopy.title}</h1>
        </div>
        <div class="content">
          <p>Hi ${orderDetails.customerName || 'there'},</p>
          <p>${statusCopy.message}</p>
          <div class="order-details">
            <h3>Order Number: ${orderDetails.orderId}</h3>
            <p class="status">Current Status: ${status}</p>
          </div>
          <div class="order-details">
            <h3>Order Items:</h3>
            ${items.map(item => `
              <div class="product-item">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
              </div>
            `).join('')}
          </div>
          <p>If you have any questions, reply to this email and we'll be happy to help.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Candour Jewelry. All rights reserved.</p>
          <p>Email: info@candourjewelry.com | Phone: +1-800-JEWELRY</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(email, `Order Update - ${statusCopy.title}`, htmlContent);
};

export const sendAdminOrderNotification = async (orderDetails, status = 'pending') => {
  const recipients = getAdminRecipients();
  if (recipients.length === 0) {
    return { success: false, error: 'Admin email recipients not configured' };
  }

  const items = formatOrderItems(orderDetails.items);
  const statusCopy = getStatusCopy(status);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #111827; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Admin Order Alert</h1>
        </div>
        <div class="content">
          <p>A customer order has been updated.</p>
          <div class="order-details">
            <h3>Order Number: ${orderDetails.orderId}</h3>
            <p><strong>Status:</strong> ${statusCopy.title}</p>
            <p><strong>Customer:</strong> ${orderDetails.customerName || 'N/A'} (${orderDetails.customerEmail || 'N/A'})</p>
            <p><strong>Total:</strong> $${orderDetails.totalPrice.toFixed(2)}</p>
          </div>
          <div class="order-details">
            <h3>Items:</h3>
            ${items.map(item => `
              <div class="product-item">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Candour Jewelry.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(recipients.join(','), `Admin Order Update - ${statusCopy.title}`, htmlContent);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #B8860B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .reset-button { background-color: #B8860B; color: white; padding: 12px 30px; text-align: center; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="reset-button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${resetLink}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Candour Jewelry. All rights reserved.</p>
          <p>Email: info@candourjewelry.com | Phone: +1-800-JEWELRY</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Password Reset - Candour Jewelry', htmlContent);
};

export const sendWelcomeEmail = async (email, userName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #B8860B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Candour Jewelry!</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for joining our community of jewelry lovers! We're thrilled to have you on board.</p>
          <p>With your account, you can:</p>
          <ul>
            <li>Browse our exclusive collections</li>
            <li>Track your orders in real-time</li>
            <li>Save your favorite pieces</li>
            <li>Receive special offers and early access to new designs</li>
          </ul>
          <p>Start exploring our handcrafted jewelry pieces today!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Candour Jewelry. All rights reserved.</p>
          <p>Email: info@candourjewelry.com | Phone: +1-800-JEWELRY</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Welcome to Candour Jewelry!', htmlContent);
};

export default {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAdminOrderNotification,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
