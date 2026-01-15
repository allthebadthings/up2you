import { Router } from 'express'
import type { Request, Response } from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { createOrderRecord, computeTotals, getOrderWithItems } from '../services/orders.js'

dotenv.config()

const router = Router()
const stripeSecret = process.env.STRIPE_SECRET_KEY || ''
const stripe = new Stripe(stripeSecret, { apiVersion: '2025-12-15.clover' })

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body || {}
    const items = Array.isArray(body.items) ? body.items : []
    const shipping = body.shipping || {}

    if (!items.length) {
      res.status(400).json({ error: 'Items are required' })
      return
    }
    const required = ['email', 'first_name', 'last_name', 'address', 'city', 'state', 'zip_code']
    const missing = required.filter(k => !shipping[k])
    if (missing.length) {
      res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
      return
    }

    const totals = computeTotals(items)

    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(503).json({ error: 'Stripe not configured' })
      return
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(totals.total * 100),
      currency: 'usd'
    })

    const { order } = await createOrderRecord(items, shipping, intent.id)

    res.json({ clientSecret: intent.client_secret, orderId: order.id, orderNumber: order.order_number })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(400).json({ error: 'Order id is required' })
      return
    }
    const data = await getOrderWithItems(id)
    res.json(data)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export const ordersRoutes = router
