import { Link, Outlet } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, Sun, Moon } from 'lucide-react'
import { useCart } from '../store/cart'
import { useTheme } from '../hooks/useTheme'
import { useState } from 'react'
import { Button, Badge } from './ui'
import ChatWidget from './ChatWidget'

export default function Layout() {
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-background-dark font-sans transition-colors duration-200">
      <header className="bg-white dark:bg-surface-dark border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">Up2You</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/catalog" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-blue font-medium transition-colors">Catalog</Link>
              <Link to="/bundles" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-blue font-medium transition-colors">Bundles</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} className="text-neutral-400 hover:text-yellow-400" /> : <Moon size={20} />}
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Search size={20} className="dark:text-neutral-400" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <User size={20} className="dark:text-neutral-400" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingBag size={20} className="dark:text-neutral-400" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1">
                      <Badge variant="primary" size="sm" rounded="full" className="px-1.5 py-0.5 text-[10px]">
                        {itemCount}
                      </Badge>
                    </span>
                  )}
                </Button>
              </Link>
              <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
                  {open ? <X size={20} className="dark:text-neutral-400" /> : <Menu size={20} className="dark:text-neutral-400" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {open && (
            <nav className="md:hidden py-4 space-y-2 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/catalog" onClick={() => setOpen(false)} className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-blue font-medium rounded-lg">Catalog</Link>
              <Link to="/bundles" onClick={() => setOpen(false)} className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-blue font-medium rounded-lg">Bundles</Link>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-white dark:bg-surface-dark border-t border-neutral-200 dark:border-neutral-800 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">Up2You</span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Premium jewelry for the modern lifestyle.
                <br />
                Beautifully crafted, ethically sourced.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Shop</h4>
              <ul className="space-y-2 text-neutral-500 dark:text-neutral-400 text-sm">
                <li><Link to="/catalog" className="hover:text-primary-blue transition-colors">All Jewelry</Link></li>
                <li><Link to="/catalog" className="hover:text-primary-blue transition-colors">New Arrivals</Link></li>
                <li><Link to="/bundles" className="hover:text-primary-blue transition-colors">Bundles</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-500 dark:text-neutral-400 text-sm">
                <li><Link to="/contact" className="hover:text-primary-blue transition-colors">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-primary-blue transition-colors">Shipping</Link></li>
                <li><Link to="/returns" className="hover:text-primary-blue transition-colors">Returns</Link></li>
                <li><Link to="/admin" className="hover:text-primary-blue transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Stay Updated</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Subscribe for exclusive offers and new drops.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-8 text-center text-neutral-400 dark:text-neutral-500 text-sm">
            <p>&copy; 2025 Up2You. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
