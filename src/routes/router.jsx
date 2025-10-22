import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import Home from './User/Home'
import Cart from './User/Cart'
import Dashboard from './Admin/Dashboard'
import ProductDetails from './User/ProductDetails'
import Shop from './User/Shop' 


// Create root route
const rootRoute = createRootRoute()

// Create individual routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: Shop, 
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Dashboard,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetails,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  cartRoute,
  adminRoute,
  productRoute,
])

// Create the router
export const router = createRouter({ routeTree })