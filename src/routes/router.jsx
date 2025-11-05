import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import Home from './User/Home'
import Cart from './User/Cart'
import Dashboard from './Admin/Dashboard'
import ProductDetails from './User/ProductDetails'
import Shop from './User/Shop' 
import TestComp from './User/TestComp'
import AdminLayout from '../layouts/AdminLayout'
import MainLayout from '../layouts/MainLayout'

// Create root route
const rootRoute = createRootRoute()

// Layout wrappers
const withMainLayout = (Component) => (props) => (
  <MainLayout>
    <Component {...props} />
  </MainLayout>
)

const withAdminLayout = (Component) => (props) => (
  <AdminLayout>
    <Component {...props} />
  </AdminLayout>
)

// Public routes with MainLayout
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withMainLayout(Home),
})

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: withMainLayout(Shop),
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

const testCompRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-comp',
  component: withMainLayout(TestComp),
})


const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: withAdminLayout(Dashboard),
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  cartRoute,
  adminRoute,
  productRoute,
  testCompRoute
])

// Create the router
export const router = createRouter({ routeTree })