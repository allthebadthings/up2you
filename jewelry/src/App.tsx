import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import UP2YouHome from './pages/UP2YouHome'
import Catalog from './pages/Catalog'
import Bundles from './pages/Bundles'
import ProductPage from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import AdminGuard from './components/admin/AdminGuard'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import Auth0Demo from './pages/Auth0Demo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UP2YouHome />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="bundles" element={<Bundles />} />
          <Route path="simple-statements" element={<Bundles />} />
          <Route path="reinvent-yourself" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Reinvent Yourself</h1><p className="text-white/70">Coming soon...</p></div></div>} />
          <Route path="break-the-chains" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Break the Chains</h1><p className="text-white/70">Builder coming soon...</p></div></div>} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirmation" element={<Confirmation />} />
          <Route path="auth0" element={<Auth0Demo />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<div className="p-6">Orders coming soon...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
