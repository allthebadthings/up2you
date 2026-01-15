import { Package, Truck, Globe } from 'lucide-react'

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Shipping Information</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fast and reliable shipping for all your jewelry purchases
          </p>
        </div>

        <div className="space-y-8">
          {/* Shipping Methods */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Methods</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Package className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Standard Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">5-7 business days</p>
                  <p className="text-gray-900 dark:text-white font-semibold">$5.99</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Truck className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Express Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">2-3 business days</p>
                  <p className="text-gray-900 dark:text-white font-semibold">$12.99</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Globe className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">International Shipping</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">10-15 business days</p>
                  <p className="text-gray-900 dark:text-white font-semibold">Starting at $19.99</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✓ Free standard shipping on orders over $100
              </p>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Processing Time</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              If we are experiencing a high volume of orders, shipments may be delayed by a few days. We will notify you if this occurs.
            </p>
          </div>

          {/* Tracking */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Tracking</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You will receive a tracking number via email once your order has shipped. You can track your package using the tracking link provided in the email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
