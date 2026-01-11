import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

interface AuthState {
  checked: boolean
  authenticated: boolean
  user?: {
    email: string
    name: string
  }
}

export default function AdminGuard() {
  const { theme, toggleTheme } = useTheme()
  const [auth, setAuth] = useState<AuthState>({ checked: false, authenticated: false })
  const location = useLocation()

  useEffect(() => {
    fetch('/api/auth/me', {
      headers: {
        'x-admin-token': localStorage.getItem('admin_token') || ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setAuth({
          checked: true,
          authenticated: data.authenticated,
          user: data.user
        })
      })
      .catch(() => {
        setAuth({ checked: true, authenticated: false })
      })
  }, [location.pathname])

  if (!auth.checked) {
    return <div className="flex min-h-screen items-center justify-center">Loading admin session...</div>
  }

  if (!auth.authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-200">
      <nav className="bg-white dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/admin" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Dashboard
                </a>
                <a href="/admin/products" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Products
                </a>
                <a href="/admin/settings" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Settings
                </a>
                <a href="/admin/orders" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Orders
                </a>
                <a href="/" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Back to Shop
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">{auth.user?.email}</span>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/admin/login')
                }}
                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
