import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from '../LoginButton'
import LogoutButton from '../LogoutButton'
import Profile from '../Profile'

export default function Auth0Demo() {
  const { isAuthenticated, isLoading, error } = useAuth0()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark text-gray-700 dark:text-gray-200 transition-colors duration-200">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark transition-colors duration-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Error</div>
          <div className="text-red-600 dark:text-red-400 mt-2">{error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Auth0 Demo</h1>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="text-green-600 dark:text-green-400 text-center font-medium">Authenticated</div>
            <Profile />
            <div className="flex justify-center">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-300">Sign in to get started</p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
