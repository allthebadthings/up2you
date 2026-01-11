import { useState, useEffect } from 'react'
import { Save, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminSettings() {
  const [propertyId, setPropertyId] = useState('')
  const [widgetId, setWidgetId] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/chat')
      const data = await res.json()
      setPropertyId(data.propertyId || '')
      setWidgetId(data.widgetId || '')
      setEnabled(data.enabled || false)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: propertyId.trim(),
          widgetId: widgetId.trim(),
          enabled
        })
      })

      if (!res.ok) {
        throw new Error('Failed to save settings')
      }

      setMessage({ type: 'success', text: 'Settings saved successfully! The chat widget will update on the next page load.' })

      // Optionally reload the page to show the new chat widget
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure integrations and site settings
        </p>
      </div>

      {/* Live Chat Settings */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <MessageCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Chat (Tawk.to)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your Tawk.to account for real-time customer chat
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
            📄 Need help setting this up?
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
            Follow the simple step-by-step guide in the <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">CHAT_SETUP_GUIDE.md</code> file.
            It takes about 5 minutes and includes screenshots.
          </p>
          <a
            href="https://www.tawk.to"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Don't have an account? Sign up free at Tawk.to →
          </a>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="e.g., 5f8a2b3c4d5e6f7g8h9i0j1k"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Find this in your Tawk.to dashboard → Administration → Channels → Chat Widget
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Widget ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={widgetId}
              onChange={(e) => setWidgetId(e.target.value)}
              placeholder="e.g., default or 1a2b3c4d"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Usually "default" unless you created a custom widget
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable live chat widget on website
            </label>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !propertyId.trim() || !widgetId.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How it works:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. Sign up for free at Tawk.to (if you haven't already)</li>
            <li>2. Create a property and get your Property ID and Widget ID</li>
            <li>3. Paste both IDs above and enable the chat</li>
            <li>4. Save settings - the real chat will appear on your website!</li>
            <li>5. Download the Tawk.to mobile app to chat with customers anywhere</li>
          </ul>
        </div>
      </div>

      {/* Future Settings Sections */}
      <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          More settings coming soon...
        </p>
      </div>
    </div>
  )
}
