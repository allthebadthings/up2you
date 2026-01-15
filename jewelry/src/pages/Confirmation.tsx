import { useEffect, useState } from 'react'
import { CheckCircle, Package, Clock, Home, Truck } from 'lucide-react'

export default function Confirmation() {
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('order')
    if (!orderId) return
    ;(async () => {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      if (res.ok) {
        setOrder(data.order)
        setItems(Array.isArray(data.items) ? data.items : [])
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Order Number: <span className="font-medium text-gray-900">#{order?.order_number || '—'}</span></p>
                <p>Order Date: <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span></p>
                <p>Estimated Delivery: <span className="font-medium text-gray-900">{estimatedDelivery}</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order?.address}</p>
                <p>{order?.city}, {order?.state} {order?.zip_code}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${(Number(item.product_price) * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${Number(item.product_price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${Number(order?.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(order?.bundle_discount || 0) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Bundle Discount (15%)</span>
                  <span>-${Number(order?.bundle_discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${Number(order?.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${Number(order?.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>${Number(order?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Processing</h3>
              <p className="text-sm text-gray-600">Your order is being prepared</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Shipping</h3>
              <p className="text-sm text-gray-600">Estimated delivery by {estimatedDelivery}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Tracking</h3>
              <p className="text-sm text-gray-600">You'll receive tracking info via email</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Print Receipt
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Questions about your order? Contact us at <span className="font-medium text-yellow-600">support@jewelrystore.com</span></p>
          <p>Order reference: #{order?.order_number || '—'}</p>
        </div>
      </div>
    </div>
  )
}
