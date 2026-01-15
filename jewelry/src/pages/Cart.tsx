import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../store/cart'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const calculateBundleSavings = () => {
    // Simple bundle discount logic - 15% off when buying 3+ items
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    if (itemCount >= 3) {
      return total * 0.15
    }
    return 0
  }

  const bundleSavings = calculateBundleSavings()
  const subtotal = total
  const finalTotal = subtotal - bundleSavings

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-neutral-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-8">Add some beautiful jewelry to your cart and start shopping!</p>
          <Link 
            to="/catalog"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">{item.product.metal_type}</p>
                        {item.product.is_bundle && (
                          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded text-xs font-semibold mt-1">
                            Bundle
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 border border-gray-300 dark:border-neutral-600 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 border border-gray-300 dark:border-neutral-600 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-700 p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {bundleSavings > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-500">
                  <span>Bundle Discount (15%)</span>
                  <span>-${bundleSavings.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-neutral-700 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {items.length >= 3 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-400">
                  🎉 You're saving ${bundleSavings.toFixed(2)} with our bundle discount!
                </p>
              </div>
            )}

            <Link
              to="/checkout"
              className="w-full mt-6 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/catalog"
              className="w-full mt-3 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}