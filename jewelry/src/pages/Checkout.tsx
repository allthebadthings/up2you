import { useEffect, useState } from 'react'
import { Lock, Truck } from 'lucide-react'
import { useCart } from '../store/cart'
import { loadStripe } from '@stripe/stripe-js'
import type { StripeElementsOptionsClientSecret } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

type CheckoutFormData = {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
}

function StripePaymentSection({
  orderId,
  onSuccess,
  loading,
  setLoading
}: {
  orderId: string
  onSuccess: () => void
  loading: boolean
  setLoading: (v: boolean) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const confirmPayment = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      })
      if (error) {
        alert(error.message || 'Payment failed')
        return
      }
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      <div className="mt-2 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg flex items-center gap-2">
        <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Your payment information is encrypted and secure</span>
      </div>
      <button
        type="button"
        onClick={confirmPayment}
        className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
        disabled={loading || !stripe || !elements || !orderId}
      >
        {loading ? 'Processing…' : 'Complete Purchase'}
      </button>
    </div>
  )
}

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (key) {
      setStripePromise(loadStripe(key))
    } else {
      (async () => {
        try {
          const res = await fetch('/api/stripe/public-key')
          const data = await res.json()
          if (data.publishableKey) {
            setStripePromise(loadStripe(data.publishableKey))
          }
        } catch (e) {
          console.error('Failed to load Stripe key', e)
        }
      })()
    }
  }, [])

  const startPayment = async () => {
    setLoading(true)
    try {
      const payloadItems = items.map(it => ({
        product_id: it.product.id,
        product_name: it.product.name,
        product_price: it.product.price,
        quantity: it.quantity
      }))
      const shipping = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems, shipping })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Order creation failed')
      setClientSecret(data.clientSecret)
      setOrderId(data.orderId)
    } catch (e) {
      alert((e as any).message || 'Failed to start payment')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    navigate(`/confirmation?order=${encodeURIComponent(orderId)}`)
  }

  const calculateBundleSavings = () => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    if (itemCount >= 3) {
      return total * 0.15
    }
    return 0
  }

  const bundleSavings = calculateBundleSavings()
  const finalTotal = total - bundleSavings

  const appearanceTheme: 'night' | 'stripe' = isDark ? 'night' : 'stripe'
  const elementsOptions: StripeElementsOptionsClientSecret | undefined = clientSecret
    ? { clientSecret, appearance: { theme: appearanceTheme } }
    : undefined

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-8">Secure Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment</h2>
              {!clientSecret ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">We’ll create your secure payment session.</p>
                  <button
                    type="button"
                    onClick={startPayment}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
                    disabled={loading}
                  >
                    {loading ? 'Preparing…' : 'Continue to Payment'}
                  </button>
                </div>
              ) : (
                stripePromise ? (
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <StripePaymentSection
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </Elements>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading payment form…</p>
                )
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.product.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {bundleSavings > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-500">
                  <span>Bundle Discount (15%)</span>
                  <span>-${bundleSavings.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>${(finalTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${(finalTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {items.length >= 3 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-400">
                  🎉 You're saving ${bundleSavings.toFixed(2)} with our bundle discount!
                </p>
              </div>
            )}

            {!clientSecret && (
              <button
                type="button"
                onClick={startPayment}
                className="w-full mt-6 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Lock className="w-4 h-4" />
                Continue to Payment
              </button>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-300">Free shipping on all orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
