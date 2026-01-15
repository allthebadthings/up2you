import { supabase } from '../db/supabase.js'

export type OrderItemInput = {
  product_id?: string
  product_name: string
  product_price: number
  quantity: number
}

export type ShippingInput = {
  email: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  zip_code: string
}

export type Totals = {
  subtotal: number
  bundle_discount: number
  tax: number
  shipping: number
  total: number
}

export function computeTotals(items: OrderItemInput[]): Totals {
  const subtotal = items.reduce((sum, it) => sum + it.product_price * it.quantity, 0)
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0)
  const bundle_discount = itemCount >= 3 ? subtotal * 0.15 : 0
  const taxable = subtotal - bundle_discount
  const tax = taxable * 0.08
  const shipping = 0
  const total = taxable + tax + shipping
  return { subtotal, bundle_discount, tax, shipping, total }
}

function genOrderNumber(): string {
  return Math.random().toString(36).slice(2, 11).toUpperCase()
}

export async function createOrderRecord(
  items: OrderItemInput[],
  shipping: ShippingInput,
  stripe_payment_intent_id: string | null
) {
  const totals = computeTotals(items)
  const order_number = genOrderNumber()

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([
      {
        order_number,
        email: shipping.email,
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip_code: shipping.zip_code,
        subtotal: Number(totals.subtotal.toFixed(2)),
        bundle_discount: Number(totals.bundle_discount.toFixed(2)),
        tax: Number(totals.tax.toFixed(2)),
        shipping: Number(totals.shipping.toFixed(2)),
        total: Number(totals.total.toFixed(2)),
        status: 'pending',
        payment_status: 'pending',
        stripe_payment_intent_id: stripe_payment_intent_id || null
      }
    ])
    .select()
    .single()

  if (orderErr) {
    throw new Error(orderErr.message)
  }

  const lineItems = items.map(it => ({
    order_id: order.id,
    product_id: it.product_id || null,
    product_name: it.product_name,
    product_price: Number(it.product_price.toFixed(2)),
    quantity: it.quantity
  }))

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(lineItems)

  if (itemsErr) {
    throw new Error(itemsErr.message)
  }

  return { order, totals }
}

export async function getOrderWithItems(id: string) {
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (orderErr) throw new Error(orderErr.message)

  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)
  if (itemsErr) throw new Error(itemsErr.message)

  return { order, items }
}

