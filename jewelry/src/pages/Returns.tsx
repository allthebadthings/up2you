import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Returns & Exchanges</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your satisfaction is our priority. Easy returns within 30 days.
          </p>
        </div>

        <div className="space-y-8">
          {/* Return Policy */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <RotateCcw className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">30-Day Return Policy</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We accept returns within 30 days of delivery. Items must be unworn, undamaged, and in their original packaging with all tags attached.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-400 text-sm">
                <strong>Note:</strong> Custom or personalized items cannot be returned unless defective.
              </p>
            </div>
          </div>

          {/* What Can Be Returned */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Can Be Returned</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Unworn items with tags</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">In original packaging and condition</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Defective or damaged items</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">We'll provide a full refund or replacement</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Wrong item received</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">We'll send the correct item at no charge</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-neutral-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cannot Be Returned:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Custom or personalized jewelry</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Items with missing tags or packaging</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Worn or damaged items (unless defective)</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Return an Item</h2>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Contact Us</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Email contact@up2you.com with your order number and reason for return</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Receive Instructions</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">We'll send you a return authorization and shipping label</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Pack & Ship</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Securely package the item and ship using the provided label</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Get Your Refund</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Refund will be processed within 5-7 business days after we receive the item</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Exchanges */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Exchanges</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We currently don't offer direct exchanges. To exchange an item:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Return the original item for a refund</li>
              <li>Place a new order for the item you want</li>
            </ol>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              This ensures you get your preferred item quickly without waiting for the return to process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
