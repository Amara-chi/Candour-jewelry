# Candour Jewelry - Full-Stack E-Commerce Application Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Architectural Concepts & Implementation](#architectural-concepts--implementation)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [API Documentation](#api-documentation)
7. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**Candour Jewelry** is a premium full-stack e-commerce platform for luxury jewelry. The application features:
- Product management (admin panel)
- Shopping cart with persistent storage
- Secure checkout and order management
- Email notifications with Nodemailer
- Image uploads via Cloudinary
- SEO optimization across all pages
- Progressive Web App (PWA) capabilities
- Dark mode support

**Tech Stack:**
- **Frontend**: React 19 + Vite + TanStack Router + Redux Toolkit
- **Backend**: Node.js + Express + MongoDB
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Styling**: Tailwind CSS
- **Authentication**: JWT + bcryptjs
- **File Storage**: Cloudinary
- **Email**: Nodemailer

---

## 🏗️ Architecture Overview

The application follows a modern, scalable architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│  ┌─────────────────────────────────────┐│
│  │  Pages/Routes (TanStack Router)    ││
│  ├─────────────────────────────────────┤│
│  │  Components (Modular & Reusable)   ││
│  ├─────────────────────────────────────┤│
│  │  Redux Store (Global State)        ││
│  │  └─ Redux Persist (localStorage)   ││
│  ├─────────────────────────────────────┤│
│  │  Hooks (Custom Business Logic)     ││
│  │  └─ useCart, useAuth, useProducts  ││
│  ├─────────────────────────────────────┤│
│  │  SWR (Data Fetching & Caching)     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
           ↕ (HTTP/API Calls)
┌─────────────────────────────────────────┐
│     Backend (Express + MongoDB)         │
│  ┌─────────────────────────────────────┐│
│  │  Routes (RESTful API Endpoints)    ││
│  ├─────────────────────────────────────┤│
│  │  Controllers (Business Logic)      ││
│  ├─────────────────────────────────────┤│
│  │  Models (MongoDB Schemas)          ││
│  ├─────────────────────────────────────┤│
│  │  Middleware (Auth, Error Handler)  ││
│  ├─────────────────────────────────────┤│
│  │  External Services                 ││
│  │  └─ Cloudinary, Nodemailer        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## 🎨 Architectural Concepts & Implementation

### 1️⃣ **Global State Management (Redux Toolkit - RTK)**

**What it is:** A centralized store that holds the entire application state, making data accessible from any component without prop drilling.

**Where it's used:**
- Cart management
- Authentication state
- Product management
- User preferences

#### Implementation Details:

**File**: `src/app/store.js`
```javascript
// Configure Redux store with persist middleware
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    product: productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(persistMiddleware)
});
```

**File**: `src/features/cart/cartSlice.js`
```javascript
// Define async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    // Fetches cart from backend API
    const response = await cartAPI.getCart();
    return response.data;
  }
);

// Create slice with reducers
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      // Handle loading and error states
  }
});
```

**Usage in Components**:
```javascript
// In Cart.jsx
const { cart } = useCart(); // Custom hook using Redux
const dispatch = useDispatch();

// Add item to cart (dispatches thunk)
const handleAddToCart = () => {
  dispatch(addToCart({ productId, quantity }));
};
```

**Benefits:**
- Single source of truth for application state
- Predictable state updates via actions
- Time-travel debugging with Redux DevTools
- Seamless integration with persistence

---

### 2️⃣ **Intersection Observer**

**What it is:** A native browser API that detects when DOM elements enter/exit the viewport, enabling lazy loading and performance optimization.

**Where it's used:**
- Lazy loading product images
- Infinite scroll detection
- Performance metrics

#### Implementation Details:

**File**: `src/components/LazyImage.jsx`
```javascript
import { useInView } from 'react-intersection-observer';

export const LazyImage = ({ src, alt, priority = false, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  
  // Detect when image enters viewport
  const { ref, inView } = useInView({
    threshold: 0,           // Trigger when ANY part enters viewport
    triggerOnce: true,      // Only load once
    rootMargin: '50px 0px'  // Start loading 50px before entering viewport
  });

  useEffect(() => {
    // Only fetch image when it enters view
    if (inView && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src]);

  return (
    <div ref={ref}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};
```

**Usage in Product Grid**:
```javascript
// ProductCard.jsx
<LazyImage 
  src={product.images[0]?.url} 
  alt={product.name}
  priority={index < 3} // Load first 3 images eagerly
/>
```

**Performance Gains:**
- Reduced initial page load time
- Lower bandwidth usage (images not loaded if user doesn't scroll)
- Improved Core Web Vitals (LCP - Largest Contentful Paint)
- Measurable difference on slow networks

---

### 3️⃣ **Component Portalling**

**What it is:** Renders components outside their parent DOM hierarchy to avoid CSS stacking/overflow issues, commonly used for modals and dropdowns.

**Where it's used:**
- Modal dialogs (login, product forms)
- Tooltips
- Dropdown menus
- Notifications

#### Implementation Details:

**File**: `src/components/Modal.jsx`
```javascript
import ReactDOM from 'react-dom';

// Modal Provider - wraps entire app
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ModalContainer /> {/* Renders at root level */}
    </ModalContext.Provider>
  );
};

// Modal Container - renders via Portal
const ModalContainer = () => {
  const { modal } = useModal();

  if (!modal) return null;

  // Renders modal outside component tree (at document.body level)
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg">
        {/* Modal content here */}
      </div>
    </div>,
    document.getElementById('modal-root') // Portal destination
  );
};
```

**HTML Structure** (`index.html`):
```html
<div id="root"></div>
<div id="modal-root"></div> <!-- Modal renders here -->
```

**Usage in Components**:
```javascript
// ProductFormModal trigger
const { openModal } = useModal();

const handleEditProduct = (product) => {
  openModal('product-form', { product, mode: 'edit' });
};
```

**Benefits:**
- Modals appear above all content (no z-index wars)
- No overflow hidden issues from parent containers
- Clean DOM structure
- Reusable modal system

---

### 4️⃣ **Persisting Data (Redux Persist)**

**What it is:** Automatically saves and restores Redux state from browser localStorage across page reloads.

**Where it's used:**
- Cart items persist when user leaves and returns
- Authentication tokens survive browser refresh
- User preferences (dark mode, filters)

#### Implementation Details:

**File**: `src/app/store.js`
```javascript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// Configure what to persist
const persistConfig = {
  key: 'candour-jewelry',           // localStorage key
  storage,                           // Use localStorage
  whitelist: ['cart', 'auth']        // Only persist these reducers
};

// Wrap reducer with persist middleware
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

// Create persistor
export const persistor = persistStore(store);
```

**Usage in App**:
```javascript
// App.jsx
import { PersistGate } from 'redux-persist/integration/react';

<Provider store={store}>
  <PersistGate loading={<LoadingScreen />} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

**Data Flow**:
```
User adds item to cart
         ↓
Redux action dispatched
         ↓
cartSlice reducer updates state
         ↓
Redux Persist middleware detects change
         ↓
State automatically saved to localStorage
         ↓
User closes browser
         ↓
User returns later
         ↓
Redux Persist rehydrates state from localStorage
         ↓
Cart is restored with all items
```

**Benefits:**
- Seamless user experience (cart doesn't disappear)
- Reduced server requests (state available locally)
- Works completely offline
- Zero additional code in components

---

### 5️⃣ **Optimistic Updates**

**What it is:** Immediately update the UI before the server confirms, providing instant feedback while validating in the background.

**Where it's used:**
- Adding items to cart
- Updating quantities
- Removing items
- Liking/favoriting products

#### Implementation Details:

**File**: `src/hooks/useCart.js`
```javascript
export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    // 1. OPTIMISTIC: Immediately update UI
    const previousCart = cart.items;
    dispatch(updateCartOptimistic({ itemId, newQuantity }));

    try {
      // 2. SERVER: Send update to backend
      const response = await cartAPI.updateCartItem(itemId, newQuantity);
      
      // 3. CONFIRM: If successful, update with server data
      dispatch(updateCartSuccess(response.data));
    } catch (error) {
      // 4. ROLLBACK: If failed, revert to previous state
      dispatch(updateCartError(previousCart));
      console.error('Update failed:', error);
    }
  }, [cart, dispatch]);

  return { updateQuantity, cart };
};
```

**Redux Slice Handlers**:
```javascript
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalPrice: 0 },
  reducers: {
    // Optimistic update - instant UI change
    updateCartOptimistic: (state, action) => {
      const item = state.items.find(i => i._id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.newQuantity;
        // Recalculate total
        state.totalPrice = calculateTotal(state.items);
      }
    },
    // Rollback on failure
    updateCartError: (state, action) => {
      state.items = action.payload;
    }
  }
});
```

**User Experience Flow**:
```
User clicks quantity +1
      ↓
UI immediately shows +1 (feels instant)
      ↓
Request sent to server
      ↓
Server confirms change
      ↓
State remains unchanged (already updated)
      ↓
User sees seamless, responsive interface
```

**Benefits:**
- Instant UI feedback (perceived performance improvement)
- Better user experience on slow networks
- Automatic rollback on errors
- No loading states needed for most interactions

---

### 6️⃣ **TanStack Router**

**What it is:** A type-safe router for React that manages navigation and handles dynamic routes with nested layouts.

**Where it's used:**
- Main navigation structure
- Dynamic product pages
- Admin dashboard layout
- Nested layouts (MainLayout, AdminLayout)

#### Implementation Details:

**File**: `src/routes/router.jsx`
```javascript
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';

// Root route with error boundary
const rootRoute = createRootRoute({
  errorComponent: () => <ErrorPage />
});

// Layout wrappers for reusable layouts
const withMainLayout = (Component) => (props) => (
  <MainLayout>
    <Component {...props} />
    <Footer />
  </MainLayout>
);

const withAdminLayout = (Component) => (props) => (
  <AdminLayout>
    <Component {...props} />
  </AdminLayout>
);

// Define routes
const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: withMainLayout(Shop)
});

// Dynamic route with parameter
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: withMainLayout(ProductDetails)
});

// Admin routes
const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: withAdminLayout(ManageProducts)
});

// Build route tree
const routeTree = rootRoute.addChildren([
  shopRoute,
  productRoute,
  adminProductsRoute,
  checkoutRoute,
  orderSuccessRoute
]);

// Create router instance
export const router = createRouter({ routeTree });
```

**Usage in Components**:
```javascript
import { Link, useParams, useNavigate } from '@tanstack/react-router';

// Navigation link
<Link to="/shop">Browse Shop</Link>

// Dynamic route
<Link to={`/product/${product._id}`}>View Product</Link>

// Get route params
const ProductDetails = () => {
  const { id } = useParams({ from: '/product/$id' });
  // Fetch product with id
};

// Programmatic navigation
const navigate = useNavigate();
const handleCheckout = () => {
  navigate({ to: '/checkout' });
};
```

**Route Structure**:
```
/                    → Home page
/shop                → Product listing
/product/$id         → Product detail page
/cart                → Shopping cart
/checkout            → Checkout form
/order-success       → Order confirmation
/admin/dashboard     → Admin dashboard
/admin/products      → Manage products
/admin/orders        → Manage orders
/admin/users         → Manage users
```

**Benefits:**
- Type-safe route definitions
- Nested layouts prevent repetition
- Dynamic parameters handled elegantly
- Built-in error boundaries
- Programmatic navigation

---

### 7️⃣ **SWR (Stale-While-Revalidate)**

**What it is:** A data fetching library that caches responses and revalidates in the background, providing instant data while keeping it fresh.

**Where it's used:**
- Fetching product lists
- Fetching categories
- API calls with caching needs
- Polling for real-time updates

#### Implementation Details:

**File**: `src/hooks/useProducts.js`
```javascript
import useSWR from 'swr';
import { API_URL } from '../config/api';

const fetcher = (url) => fetch(url).then(r => r.json());

export const useProducts = (options = {}) => {
  const { sort = '-createdAt', status = 'active', page = 1 } = options;
  
  // SWR hook - manages caching and revalidation
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/products?sort=${sort}&status=${status}&page=${page}`,
    fetcher,
    {
      revalidateOnFocus: true,        // Refresh when window regains focus
      revalidateOnReconnect: true,    // Refresh when reconnected to internet
      dedupingInterval: 60000,        // Don't fetch same URL within 60s
      focusThrottleInterval: 300000,  // Wait 5min before revalidating again
      errorRetryCount: 3,             // Retry failed requests 3 times
      errorRetryInterval: 5000        // Wait 5s between retries
    }
  );

  const products = data?.data || [];
  const loading = isLoading;
  const pagination = data?.pagination || {};

  return {
    products,
    loading,
    error,
    pagination,
    mutate // Manually trigger revalidation
  };
};
```

**Usage in Components**:
```javascript
// Shop.jsx
const { products, loading, error } = useProducts({ 
  sort: '-featured', 
  page: 1 
});

if (error) return <ErrorMessage />;
if (loading) return <Skeleton />;

// Data is already cached and fresh
return (
  <div>
    {products.map(product => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);
```

**Data Flow with Caching**:
```
First request:
User visits /shop
      ↓
SWR checks cache (miss)
      ↓
Fetches from API
      ↓
Caches response in memory
      ↓
Returns data to component

Second request (within cache time):
User clicks filter
      ↓
SWR checks cache (hit)
      ↓
Returns cached data INSTANTLY
      ↓
Revalidates in background
      ↓
If new data differs, updates silently

Window loses focus then regains focus:
      ↓
SWR detects focus event
      ↓
Revalidates data in background
      ↓
Updates if changed
```

**Benefits:**
- Instant data rendering (from cache)
- Background revalidation keeps data fresh
- Automatic retry on failures
- Zero waterfalls (parallel requests)
- Smaller bundle than React Query

---

### 8️⃣ **Progressive Web Application (PWA)**

**What it is:** A web app enhanced with native app-like capabilities: offline support, installable, and push notifications.

**Where it's used:**
- Offline shopping (cached products, cart)
- App installation on home screen
- Background sync
- Service worker caching

#### Implementation Details:

**File**: `vite.config.js` (PWA Configuration)
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate', // Auto-update service worker
      
      // Workbox caching strategy
      workbox: {
        // Assets to cache on install
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        
        // Cache Cloudinary images (static, infrequent changes)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
            handler: 'CacheFirst',      // Use cache, update in background
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          
          // API calls (dynamic data)
          {
            urlPattern: /^https:\/\/api\.candour-jewelry\.*/,
            handler: 'NetworkFirst',    // Use network first, fallback to cache
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60   // 5 minutes
              }
            }
          }
        ]
      },
      
      // Web app manifest
      manifest: {
        name: "Candour's Jewelry",
        short_name: "CandourJewelry",
        description: "Timeless Elegance, Handcrafted Luxury",
        theme_color: "#A9343F",
        background_color: "#0f172a",
        display: "standalone",        // Full screen like native app
        icons: [
          { src: "/icons/icon-192x192.png", sizes: "192x192" },
          { src: "/icons/icon-512x512.png", sizes: "512x512" }
        ]
      }
    })
  ]
});
```

**Service Worker Registration**:
```javascript
// Vite PWA automatically registers service worker
// Access via: navigator.serviceWorker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('PWA installed successfully');
  });
}
```

**Offline Capability Flow**:
```
User visits website (online)
      ↓
Service worker installed
      ↓
Static assets cached
      ↓
User goes offline
      ↓
Service worker intercepts requests
      ↓
Returns cached assets
      ↓
Cached API data still available
      ↓
User can browse products, view cart
      ↓
User comes back online
      ↓
Service worker syncs updates
      ↓
Fresh data loaded
```

**Installation on Home Screen**:
```
User visits website
      ↓
Browser shows "Install" prompt
      ↓
User clicks "Install"
      ↓
App installed with icon on home screen
      ↓
Opens in standalone mode (no browser chrome)
      ↓
Works like native app
```

**Benefits:**
- Works offline with cached data
- Installable on mobile/desktop
- Faster repeat visits (cache)
- Reduced bandwidth usage
- Improved perceived performance

---

## 📁 Project Structure

```
candour-jewelry/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── server.js
│
├── src/
│   ├── app/
│   │   └── store.js                    # Redux store configuration
│   ├── features/
│   │   ├── cart/
│   │   │   ├── cartSlice.js           # Redux cart state
│   │   │   ├── cartAPI.js             # Cart API calls
│   │   │   └── cartAPI.test.js
│   │   ├── product/
│   │   │   ├── productSlice.js        # Redux product state
│   │   │   └── productAPI.js
│   │   └── auth/
│   │       ├── authSlice.js           # Redux auth state
│   │       └── authAPI.js
│   ├── hooks/
│   │   ├── useCart.js                 # Cart custom hook
│   │   ├── useAuth.js                 # Auth custom hook
│   │   ├── useProducts.js             # Products SWR hook
│   │   └── useCategories.js           # Categories SWR hook
│   ├── components/
│   │   ├── Modal.jsx                  # Portal-based modals
│   │   ├── LazyImage.jsx              # Intersection Observer
│   │   ├── SEOHead.jsx                # SEO meta tags
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   ├── routes/
│   │   ├── router.jsx                 # TanStack Router config
│   │   ├── User/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CheckOut.jsx
│   │   │   └── OrderSucess.jsx
│   │   └── Admin/
│   │       ├── Dashboard.jsx
│   │       ├── Manageproducts.jsx
│   │       ├── ManageOrders.jsx
│   │       └── ManageUsers.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── config/
│   │   └── api.js                     # API base URLs
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── icons/                         # PWA icons
├── vite.config.js                     # Vite + PWA config
├── tailwind.config.js
└── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v20+
- MongoDB account (Neon or Atlas)
- Cloudinary account
- Gmail account (for Nodemailer)

### Backend Setup
```bash
cd backend
npm install

# Create .env file
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password

# Start backend
npm start  # Production
npm run dev  # Development (nodemon)
```

### Frontend Setup
```bash
npm install

# Create .env file
VITE_API_URL=http://localhost:3001
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name

# Start frontend
npm run dev
```

### Access Application
- Frontend: http://localhost:5000
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:5000/admin/dashboard

---

## 🔌 API Documentation

### Authentication Endpoints
```
POST /api/auth/register      - Register new user
POST /api/auth/login         - Login user
POST /api/auth/logout        - Logout user
GET  /api/auth/me            - Get current user
```

### Product Endpoints
```
GET    /api/products         - Get all products
GET    /api/products/:id     - Get single product
POST   /api/products         - Create product (Admin)
PUT    /api/products/:id     - Update product (Admin)
DELETE /api/products/:id     - Delete product (Admin)
```

### Cart Endpoints
```
GET    /api/cart             - Get user's cart
POST   /api/cart             - Add item to cart
PUT    /api/cart/:itemId     - Update cart item
DELETE /api/cart/:itemId     - Remove from cart
DELETE /api/cart             - Clear cart
```

### Order Endpoints
```
POST   /api/orders           - Create order
GET    /api/orders           - Get user's orders
GET    /api/orders/:id       - Get single order
GET    /api/orders/admin/all - Get all orders (Admin)
PUT    /api/orders/:id/status - Update order status (Admin)
```

---

## 💻 Development Workflow

### Adding a New Feature

**Step 1: Create API Route**
```javascript
// backend/routes/feature.js
router.post('/feature', protect, createFeature);
```

**Step 2: Create Redux Slice**
```javascript
// src/features/feature/featureSlice.js
const slice = createSlice({ /* state & reducers */ });
export const featureReducer = slice.reducer;
```

**Step 3: Create Custom Hook**
```javascript
// src/hooks/useFeature.js
export const useFeature = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.feature);
  // Business logic here
  return { data, fetchFeature, updateFeature };
};
```

**Step 4: Create Components**
```javascript
// src/components/FeatureComponent.jsx
export const FeatureComponent = () => {
  const { data, updateFeature } = useFeature();
  return ( /* JSX */ );
};
```

**Step 5: Add Route**
```javascript
// src/routes/router.jsx
const featureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feature',
  component: withMainLayout(FeatureComponent)
});
```

---

## 🧪 Testing Checklist

- [ ] User can register and login
- [ ] Products load and display correctly
- [ ] Cart persists after page reload
- [ ] Add to cart works with optimistic updates
- [ ] Checkout process completes
- [ ] Order confirmation email is sent
- [ ] Admin can create/edit/delete products
- [ ] Admin can manage orders
- [ ] Images upload to Cloudinary
- [ ] App works offline (PWA)
- [ ] SEO meta tags render correctly
- [ ] Dark mode works across all pages
- [ ] Mobile responsive design works

---

## 📚 Key Technologies Explained

### Redux Toolkit Benefits
- Simplified Redux setup (no boilerplate)
- Built-in immer for immutable updates
- Async thunks for API calls
- Built-in devtools integration

### SWR vs React Query
- Smaller bundle size
- Simpler API for basic use cases
- Request deduplication built-in
- Focus on data fetching, not caching

### TanStack Router vs React Router
- Type-safe route definitions
- Better nested layout support
- Smaller bundle size
- Framework-agnostic

---

## 🐛 Troubleshooting

### Cart not persisting
- Check if Redux Persist middleware is configured
- Verify localStorage is enabled in browser
- Check browser dev tools → Application → localStorage

### Images not loading
- Verify Cloudinary credentials in .env
- Check image upload preset exists
- Test API endpoint: `/api/products/:id`

### Emails not sending
- Verify Gmail app password (not regular password)
- Enable "Less Secure App Access"
- Check Email_USER and EMAIL_PASSWORD in .env

### PWA not installing
- Check manifest.json is valid
- Service worker must be on HTTPS (or localhost)
- Icons must exist and be correct size

---

## 📞 Support & Resources

- Redux Documentation: https://redux.js.org
- TanStack Router: https://tanstack.com/router
- SWR: https://swr.vercel.app
- React Intersection Observer: https://github.com/thebuilder/react-intersection-observer
- Vite PWA: https://vite-pwa-org.netlify.app

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
