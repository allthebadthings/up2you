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

  // Helper to validate UUIDs
  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

  // Resolve product IDs that are SKUs (e.g. Shopify IDs)
  const resolvedProductIds = new Map<string, string>() // originalId -> realUuid
  const skusToResolve = items
    .map(it => it.product_id)
    .filter(id => id && !isUuid(id)) as string[]

  if (skusToResolve.length > 0) {
    const { data: found } = await supabase
      .from('products')
      .select('id, sku')
      .in('sku', skusToResolve)
    
    found?.forEach(p => {
      resolvedProductIds.set(p.sku, p.id)
    })
  }

  const lineItems = items.map(it => {
    let finalProductId = it.product_id || null
    
    // If ID is provided but not a UUID, try to map it from resolved SKUs
    if (finalProductId && !isUuid(finalProductId)) {
       finalProductId = resolvedProductIds.get(finalProductId) || null
    }

    return {
      order_id: order.id,
      product_id: finalProductId,
      product_name: it.product_name,
      product_price: Number(it.product_price.toFixed(2)),
      quantity: it.quantity
    }
  })

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

