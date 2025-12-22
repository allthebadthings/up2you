import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { useTheme } from '../../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export default function AdminLogin() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [devToken, setDevToken] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token') || ''
    const headers: Record<string, string> = {}
    if (token) {
      headers['x-admin-token'] = token
    }

    fetch('/api/auth/me', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data.authenticated) navigate('/admin')
      })
      .catch(err => {
        console.log('Not authenticated or API not available', err);
      })
  }, [navigate])

  const handleDevLogin = () => {
    localStorage.setItem('admin_token', devToken)
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your store
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <Button
              onClick={() => window.location.href = '/api/auth/google/start'}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-background-dark text-gray-500 dark:text-gray-400">Or use dev token</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Dev Admin Token"
              value={devToken}
              onChange={(value) => setDevToken(value)}
            />
            <Button onClick={handleDevLogin} variant="secondary">
              Set Token
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
