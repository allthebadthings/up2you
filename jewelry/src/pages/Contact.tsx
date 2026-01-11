import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We'd love to hear from you. Get in touch with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <Mail className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">contact@up2you.com</p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <Phone className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">(555) 123-4567</p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <MapPin className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Online Store</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
