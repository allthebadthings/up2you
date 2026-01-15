import { Fragment, useEffect, useState } from 'react'
import { Card } from '../../components/ui'
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'

type Order = {
  id: string
  order_number: string
  created_at: string
  email: string
  first_name: string
  last_name: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
}

type OrderItem = {
  id: string
  product_name: string
  product_price: number
  quantity: number
}

type OrderDetails = {
  order: Order & {
    address?: string
    city?: string
    state?: string
    zip_code?: string
    subtotal?: number
    bundle_discount?: number
    tax?: number
    shipping?: number
  }
  items: OrderItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailsById, setDetailsById] = useState<Record<string, OrderDetails>>({})
  const [detailsLoading, setDetailsLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token') || ''
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-token': token }
      })
      const data = await res.json()
      if (data.items) {
        setOrders(data.items)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    if (detailsById[orderId] || detailsLoading[orderId]) return
    setDetailsLoading(prev => ({ ...prev, [orderId]: true }))
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      if (res.ok && data?.order) {
        setDetailsById(prev => ({ ...prev, [orderId]: data }))
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setDetailsLoading(prev => ({ ...prev, [orderId]: false }))
    }
  }

  const toggleDetails = (orderId: string) => {
    const next = expandedId === orderId ? null : orderId
    setExpandedId(next)
    if (next) fetchOrderDetails(next)
  }

  const formatCurrency = (value?: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="p-6">Loading orders...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Orders</h1>
        <p className="text-gray-600 dark:text-neutral-400">
          Manage customer orders and shipments
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Order</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Customer</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Payment</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Fulfillment</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-neutral-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition cursor-pointer"
                      onClick={() => toggleDetails(order.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">#{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-neutral-300">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{order.first_name} {order.last_name}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">{order.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                          {getStatusIcon(order.payment_status)}
                          <span className="capitalize">{order.payment_status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-gray-50 dark:bg-neutral-900/40">
                        <td colSpan={6} className="px-6 py-4">
                          {detailsLoading[order.id] && (
                            <div className="text-sm text-gray-500 dark:text-neutral-400">Loading order details...</div>
                          )}
                          {!detailsLoading[order.id] && detailsById[order.id] && (
                            <div className="grid gap-6 lg:grid-cols-2">
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Items</h3>
                                <div className="space-y-2">
                                  {detailsById[order.id].items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-neutral-300">
                                      <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{item.product_name}</div>
                                        <div className="text-xs text-gray-500 dark:text-neutral-400">Qty: {item.quantity}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">{formatCurrency(item.product_price * item.quantity)}</div>
                                        <div className="text-xs text-gray-500 dark:text-neutral-400">{formatCurrency(item.product_price)} each</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Shipping</h3>
                                  <div className="text-sm text-gray-700 dark:text-neutral-300">
                                    <div>{detailsById[order.id].order.address}</div>
                                    <div>
                                      {detailsById[order.id].order.city}, {detailsById[order.id].order.state} {detailsById[order.id].order.zip_code}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Totals</h3>
                                  <div className="space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                                    <div className="flex justify-between">
                                      <span>Subtotal</span>
                                      <span>{formatCurrency(detailsById[order.id].order.subtotal)}</span>
                                    </div>
                                    {Number(detailsById[order.id].order.bundle_discount || 0) > 0 && (
                                      <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Bundle Discount</span>
                                        <span>-{formatCurrency(detailsById[order.id].order.bundle_discount)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Tax</span>
                                      <span>{formatCurrency(detailsById[order.id].order.tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping</span>
                                      <span>{formatCurrency(detailsById[order.id].order.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-neutral-700">
                                      <span>Total</span>
                                      <span>{formatCurrency(detailsById[order.id].order.total)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {!detailsLoading[order.id] && !detailsById[order.id] && (
                            <div className="text-sm text-gray-500 dark:text-neutral-400">Unable to load order details.</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
