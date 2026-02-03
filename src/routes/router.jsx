import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import Home from './User/Home'
import Cart from './User/Cart'
import Dashboard from './Admin/Dashboard'
import ProductDetails from './User/ProductDetails'
import Shop from './User/Shop' 
import Contact from './User/Contact'
import CheckOut from './User/CheckOut'
import OrderSuccess from './User/OrderSucess'
import AdminLayout from '../layouts/AdminLayout'
import MainLayout from '../layouts/MainLayout'
import Footer from '../components/Footer'
import ManageProducts from './Admin/Manageproducts'
import ManageUsers from './Admin/ManageUsers'
import ManageOrders from './Admin/ManageOrders'
import ManageCategories from './Admin/ManageCategories'
import OrderDetails from './Admin/OrderDetails'
import ProductsList from '../features/product/productsList.jsx'

// Root route
const rootRoute = createRootRoute({
  errorComponent: () => (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-white text-xl">Something went wrong!</div>
    </div>
  )
})

// Layout wrappers
const withMainLayout = (Component) => (props) => (
  <MainLayout>
    <Component {...props} />
    <Footer />
  </MainLayout>
)

const withAdminLayout = (Component) => (props) => (
  <AdminLayout>
    <MainLayout>
      <Component {...props} />
      <Footer />
    </MainLayout>
  </AdminLayout>
)

// Public routes with MainLayout
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withMainLayout(Home),
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: withMainLayout(Cart),
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: withMainLayout(ProductDetails),
})

// Add these routes
const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: withMainLayout(Shop),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: withAdminLayout(ManageProducts),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: withMainLayout(CheckOut),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: withMainLayout(Contact),
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-success',
  component: withMainLayout(OrderSuccess),
});

// Admin routes with AdminLayout
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: withAdminLayout(Dashboard),
})

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: withAdminLayout(ManageUsers),
})

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: withAdminLayout(ManageOrders),
})

const adminOrderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders/$id',
  component: withAdminLayout(OrderDetails),
})

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: withAdminLayout(ManageCategories),
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  cartRoute,
  productRoute,
  checkoutRoute,
  contactRoute,
  orderSuccessRoute,
  adminRoute,
  adminUsersRoute,
  adminProductsRoute,
  adminOrdersRoute,
  adminOrderDetailsRoute,
  adminCategoriesRoute,
])

export const router = createRouter({ routeTree })
