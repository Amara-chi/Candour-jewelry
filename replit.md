# Candour Jewelry E-Commerce Platform

**Last Updated:** November 24, 2025

## Overview
Full-stack jewelry e-commerce application with React frontend and Express/MongoDB backend. Features admin dashboard, product management, shopping cart, and order processing.

## Project Architecture

### Frontend (Port 5000)
- **Framework:** React 19 + Vite 7
- **State Management:** Redux Toolkit with Redux Persist
- **Routing:** TanStack React Router
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Framer Motion animations
- **Image Handling:** Cloudinary integration with lazy loading
- **PWA:** Service worker with offline support

### Backend (Port 3001)
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with bcrypt
- **File Upload:** Multer with Cloudinary
- **API:** RESTful endpoints for auth, products, categories, users, orders

## Current State

### ✅ Completed Setup
- Node.js 20 installed
- Frontend and backend dependencies installed
- Port configuration: Frontend on 5000, Backend on 3001
- Vite configured for Replit proxy (0.0.0.0:5000)
- CORS updated to allow Replit domains
- Combined startup script created
- Import path issues resolved
- Deployment configuration set up
- Frontend is fully functional and displays correctly

### ⚠️ Required Configuration (Next Steps)

#### MongoDB Connection (Required)
The application requires a MongoDB database. You need to provide:

**Environment Variable:**
- `MONGODB_URI` - Your MongoDB connection string

**How to set it up:**
1. Get a MongoDB connection string from:
   - MongoDB Atlas (free tier available)
   - Your own MongoDB instance
2. Add the `MONGODB_URI` environment variable in Replit Secrets

**Example format:**
```
mongodb+srv://username:password@cluster.mongodb.net/candour-jewelry?retryWrites=true&w=majority
```

#### Cloudinary Configuration (Optional but Recommended)
For image uploads, you need to configure Cloudinary:

**Environment Variables:**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

Without these, image upload features won't work, but the rest of the app will function.

## Running the Application

The application runs both frontend and backend together via the "Start application" workflow:
- Backend starts on http://localhost:3001
- Frontend starts on http://0.0.0.0:5000 (proxies API calls to backend)
- Access the app through the Replit webview

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile (protected)

### Products
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Categories
- GET `/api/categories` - List all categories
- POST `/api/categories` - Create category (admin)
- PUT `/api/categories/:id` - Update category (admin)
- DELETE `/api/categories/:id` - Delete category (admin)

### Users (Admin)
- GET `/api/users` - List all users
- GET `/api/users/:id` - Get single user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Health & Debug
- GET `/api/health` - Server health check
- GET `/api/debug/db` - Database connection status

## Database Seeding

Once MongoDB is connected, you can seed the database with initial data:

```bash
# Seed admin user
cd backend && npm run seed:admin

# Seed products
cd backend && npm run seed:products
```

## Admin Access

After seeding, you can log in to the admin panel with the credentials created by the seeder script. Check `backend/utils/seeder.js` for default admin credentials.

## File Structure

```
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── features/          # Feature-based modules (auth, cart, products, etc.)
│   ├── routes/            # Page components
│   ├── layouts/           # Layout components
│   ├── hooks/             # Custom React hooks
│   └── config/            # Configuration files
├── backend/               # Backend source
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions and seeders
├── public/               # Static assets
└── start-dev.sh          # Development startup script
```

## Deployment

The project includes Vercel configuration but can be deployed on Replit. For production:
1. Ensure all environment variables are set in production environment
2. MongoDB connection string must be for production database
3. Update CORS origins if deploying to custom domain

## Notes

- The frontend uses a proxy to communicate with the backend in development
- All API calls from the frontend automatically route through `/api` 
- Redux state is persisted in localStorage
- Service worker caches Cloudinary images for 30 days
- The app is PWA-ready with manifest and service worker configured
