// src/routes/router.jsx
import { createRouter, RouterProvider } from '@tanstack/react-router'
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from './user/Home'
import Shop from './user/Shop'
import ProductDetail from './user/ProductDetail'
import Dashboard from './admin/Dashboard'
import ManageProducts from './admin/ManageProducts'

const router = createRouter({
  routeConfig: [
    {
      path: '/',
      element: <UserLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/shop', element: <Shop /> },
        { path: '/product/:id', element: <ProductDetail /> },
        { path: '/cart', element: <Cart /> },
        { path: '/checkout', element: <Checkout />},
        { path: '/ordersuccess', element: <OrderSuccess /> }
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: '/admin', element: <Dashboard /> },
        { path: '/admin/products', element: <ManageProducts /> },
        { path: '/admin/orders', element: <ManageOrders /> },
        { path: '/admin/categories', element: <ManageCategories />},
        { path: '/admin/users', element: <ManageUsers /> }
      ],
    },
  ],
})

export default function AppRouter() {
  return <RouterProvider router={router} />
}
