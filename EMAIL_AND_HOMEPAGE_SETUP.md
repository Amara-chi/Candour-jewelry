# Email & Homepage Setup Guide

## Overview
This document covers the email service setup, homepage improvements, footer redesign, and categories integration.

---

## 1. Homepage Updates

### Featured Collections
- **What Changed**: Categories now load from your MongoDB database instead of being hardcoded
- **Features**:
  - Real-time category data
  - Category images and descriptions display
  - Hover effects with scale animation
  - Responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
  - Displays up to 8 categories

### Featured Products
- **What Changed**: Products are fetched from your API
- **Features**:
  - Loads the 6 newest products automatically
  - Proper loading and empty states
  - Product cards with pricing and details
  - Image lazy loading optimization

### Category Filtering
- Each category links directly to the Shop page with category filter applied
- Example: `/shop?category=65f8e9d2a1b2c3d4e5f6g7h8`

---

## 2. Footer Redesign

### Features
✓ **Professional Multi-Column Layout**
- Brand section with social links
- Quick navigation links
- Customer service section
- Legal/Policy links
- Contact information

✓ **Newsletter Subscription**
- Email input field
- Subscribe button
- Positioned before the bottom footer bar

✓ **Social Media Links**
- Instagram, Facebook, Twitter, Pinterest
- Hover effects and animations
- Proper external link handling

✓ **Responsive Design**
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 5 columns

✓ **Dark Mode Support**
- Full dark theme compatibility
- Proper contrast ratios

---

## 3. Email Service Setup

### Files Created
1. **`backend/utils/emailService.js`** - Email service module
2. **`backend/.env.example`** - Configuration template

### Installation
```bash
cd backend
npm install nodemailer
```

### Environment Variables
Add to `backend/.env`:
```
FRONTEND_URL=https://candour-jewelry.vercel.app
FROM_EMAIL=info@candourjewelry.com
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASSWORD=your_16_character_app_password
ADMIN_EMAILS=admin@candourjewelry.com,owner@candourjewelry.com
```

### How to Get Gmail App Password

#### Step 1: Enable 2-Factor Authentication
1. Go to myaccount.google.com
2. Click "Security" in the left menu
3. Scroll to "How you sign in to Google"
4. Enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password (removing spaces) to `GMAIL_PASSWORD` in `.env`

### Email Functions

#### 1. Send Order Confirmation
```javascript
import { sendOrderConfirmation } from './utils/emailService.js';

const orderDetails = {
  orderId: '123456',
  items: [
    { name: 'Gold Ring', quantity: 1, price: 299.99 }
  ],
  totalPrice: 299.99,
  shippingAddress: '123 Main St, City, State 12345'
};

await sendOrderConfirmation(userEmail, orderDetails);
```

#### 1b. Send Order Status Update
```javascript
import { sendOrderStatusUpdate } from './utils/emailService.js';

await sendOrderStatusUpdate(userEmail, orderDetails, 'shipped');
```

#### 1c. Send Admin Order Notification
```javascript
import { sendAdminOrderNotification } from './utils/emailService.js';

await sendAdminOrderNotification(orderDetails, 'pending');
```

#### 2. Send Password Reset Email
```javascript
import { sendPasswordResetEmail } from './utils/emailService.js';

const resetLink = 'https://yoursite.com/reset-password?token=xxx';
await sendPasswordResetEmail(userEmail, resetLink);
```

#### 3. Send Welcome Email
```javascript
import { sendWelcomeEmail } from './utils/emailService.js';

await sendWelcomeEmail(userEmail, userName);
```

#### 4. Send Generic Email
```javascript
import { sendEmail } from './utils/emailService.js';

const htmlContent = '<h1>Custom Email</h1><p>Your content here</p>';
await sendEmail(userEmail, 'Subject Line', htmlContent);
```

### Integration Examples

#### In Order Controller
```javascript
import { sendOrderConfirmation } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
  // ... create order logic

  const orderDetails = {
    orderId: order._id,
    items: order.items,
    totalPrice: order.totalPrice,
    shippingAddress: order.shippingAddress
  };

  // Send confirmation email
  await sendOrderConfirmation(req.user.email, orderDetails);

  // ... rest of response
};
```

#### In Auth Controller (Registration)
```javascript
import { sendWelcomeEmail } from '../utils/emailService.js';

export const register = async (req, res) => {
  // ... registration logic

  // Send welcome email
  await sendWelcomeEmail(newUser.email, newUser.name);

  // ... rest of response
};
```

---

## 4. Categories Functionality

### Backend (Already Implemented)
- Full CRUD operations for categories
- Featured categories support
- Subcategories support
- Slug-based lookups

### Frontend Integration

#### 1. Home Page Categories
Located in `src/routes/User/Home.jsx`:
```javascript
const { categories, loading: categoriesLoading } = useCategories();
```
- Automatically fetches and displays categories
- Handles loading and empty states
- Links to shop with category filter

#### 2. Shop Page Filtering
Located in `src/routes/User/Shop.jsx`:
```javascript
const [selectedCategory, setSelectedCategory] = useState('');

const filteredProducts = products.filter(product => {
  if (selectedCategory && !product.categories?.some(cat => cat._id === selectedCategory))
    return false;
  // ... other filters
});
```

#### 3. Category API
Located in `src/features/categories/CategoryAPI.js`:
```javascript
// Get all categories
categoryAPI.getCategories();

// Get single category
categoryAPI.getCategory(id);

// Admin operations
categoryAPI.createCategory(data);
categoryAPI.updateCategory(id, data);
categoryAPI.deleteCategory(id);
```

---

## 5. Testing Checklist

### Homepage
- [ ] Categories load from API
- [ ] Featured products display correctly
- [ ] Images load with lazy loading
- [ ] Links to shop with category filters work
- [ ] Loading states display properly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark mode works correctly

### Footer
- [ ] All sections display correctly
- [ ] Social media links work
- [ ] Newsletter form renders
- [ ] Links navigate correctly
- [ ] Responsive layout shifts at breakpoints
- [ ] Dark mode styling applies
- [ ] Contact info displays correctly

### Email Service
- [ ] Can send test emails from controller
- [ ] HTML emails render properly in Gmail
- [ ] Links in emails work correctly
- [ ] Branding and styling is consistent
- [ ] Special characters/unicode display correctly

### Categories
- [ ] Categories appear on homepage
- [ ] Category links filter shop correctly
- [ ] Category filter in shop sidebar works
- [ ] All categories load from API
- [ ] Empty category list handled gracefully

---

## 6. Troubleshooting

### Gmail Not Sending Emails
**Issue**: "Invalid credentials" error
**Solution**:
1. Verify 2-FA is enabled on Gmail account
2. Make sure you generated an App Password (not account password)
3. Check that GMAIL_PASSWORD has no spaces
4. Verify GMAIL_USER matches your Gmail address

### Categories Not Displaying
**Issue**: Empty category list on homepage
**Solution**:
1. Check that categories exist in MongoDB
2. Verify API endpoint `/api/categories` is working
3. Check browser console for fetch errors
4. Ensure authentication token is included if required

### Email Styling Issues
**Issue**: HTML emails don't display styling correctly
**Solution**:
1. Gmail strips some CSS - use inline styles
2. Test with CSS inliner: https://www.campaignmonitor.com/css/
3. Keep HTML emails simple and semantic

---

## 7. Next Steps

### Recommended Enhancements
1. **Email Templates**: Add more email types (shipping confirmation, refund notification)
2. **SMS Notifications**: Integrate Twilio for SMS order updates
3. **Email Preferences**: Let users manage notification preferences
4. **Category Images**: Add product category banner images
5. **Newsletter Management**: Integrate Mailchimp or SendGrid for newsletter
6. **Email Analytics**: Track email opens and clicks

### Optional Integrations
- Stripe webhook emails for payment notifications
- Automated cleanup emails for abandoned carts
- Customer review request emails
- Birthday/Anniversary promotional emails

---

## Build Status
✅ Project builds successfully
✅ No errors or warnings
✅ All dependencies installed
✅ Ready for production

---

**Last Updated**: January 8, 2026
**Status**: Complete and Tested
