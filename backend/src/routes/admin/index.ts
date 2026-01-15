import { Router } from 'express'
import { supabase } from '../../db/supabase.js'
import { configService } from '../../services/config.js'
import { validateAiConfig } from '../../services/ai.js'
import { generateProductDescription } from '../../services/ai.js'
import { shopifyService } from '../../services/shopify.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'
import fs from 'fs'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 1000 // Max 1000 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Configure multer for CSV uploads
const csvUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, 'csv-' + uniqueSuffix + '.csv')
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept all files for now
    cb(null, true)
  }
})

interface Product {
  id: string
  name: string
  price: number
  description?: string
  stock: number
  images?: string[]
  is_bundle?: boolean
  min_price?: number
}

// Fallback in-memory store if DB is not configured
let localProducts: Product[] = []
const useDb = !!process.env.SUPABASE_URL

const validateProduct = (body: any, partial = false) => {
  const errors: string[] = []
  
  if (!partial) {
    if (!body.name) errors.push('Name is required')
    if (typeof body.price !== 'number') errors.push('Price must be a number')
  }

  if (body.price !== undefined && typeof body.price !== 'number') {
    errors.push('Price must be a number')
  }

  if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
    errors.push('Stock must be a non-negative number')
  }

  if (body.min_price !== undefined && (typeof body.min_price !== 'number' || body.min_price < 0)) {
    errors.push('Min price must be a non-negative number')
  }

  if (body.images !== undefined && (!Array.isArray(body.images) || !body.images.every((i: any) => typeof i === 'string'))) {
    errors.push('Images must be an array of strings')
  }

  if (body.is_bundle !== undefined && typeof body.is_bundle !== 'boolean') {
    errors.push('is_bundle must be a boolean')
  }

  return errors
}

router.get('/health', (req, res) => {
  res.json({ status: 'ok', storage: useDb ? 'supabase' : 'memory' })
})

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }
    // Return the URL path that can be used to access the image
    const imageUrl = `/uploads/${req.file.filename}`
    res.json({ url: imageUrl })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Bulk image upload endpoint - supports up to 1000 images
router.post('/products/bulk-image-upload', upload.array('images', 1000), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No images uploaded' })
      return
    }

    if (!useDb) {
      res.status(503).json({ error: 'Database not configured' })
      return
    }

    let matched = 0
    const unmatched: string[] = []
    const uploaded = req.files.length

    // Get all products from database
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')

    if (fetchError) {
      res.status(500).json({ error: fetchError.message })
      return
    }

    // Create a lookup map for faster matching (filename -> {productId, imageIndex})
    const imageMap = new Map<string, { productId: string, imageIndex: number, images: string[] }>()

    for (const product of products || []) {
      const productImages = Array.isArray(product.images) ? product.images : []
      productImages.forEach((img: string, index: number) => {
        // Store both exact match and without extension
        imageMap.set(img, { productId: product.id, imageIndex: index, images: productImages })

        // Also store without extension for flexible matching
        const nameWithoutExt = img.replace(/\.[^/.]+$/, '')
        if (nameWithoutExt !== img) {
          imageMap.set(nameWithoutExt, { productId: product.id, imageIndex: index, images: productImages })
        }
      })
    }

    // Process each uploaded file
    for (const file of req.files) {
      const uploadedUrl = `/uploads/${file.filename}`
      const originalName = file.originalname
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')

      // Try to find a match
      const match = imageMap.get(originalName) || imageMap.get(nameWithoutExt)

      if (match) {
        // Replace the filename with the actual uploaded URL
        const updatedImages = [...match.images]
        updatedImages[match.imageIndex] = uploadedUrl

        // Update the product
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: updatedImages })
          .eq('id', match.productId)

        if (!updateError) {
          matched++
        } else {
          unmatched.push(originalName)
        }
      } else {
        unmatched.push(originalName)
      }
    }

    res.json({
      success: true,
      uploaded,
      matched,
      unmatched: unmatched.length > 0 ? unmatched : undefined
    })

  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/upload2', (req, res) => {
  try {
    res.json({ success: true, message: 'Test route works!' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Test endpoint
router.get('/test-csv', (req, res) => {
  res.json({ message: 'CSV upload route section is working' })
})

// CSV upload endpoint for bulk product import
console.log('Registering CSV upload route at /products/csv-upload')
router.post('/products/csv-upload', csvUpload.single('csv'), async (req, res) => {
  console.log('CSV upload route handler called!')
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No CSV file uploaded' })
      return
    }

    if (!useDb) {
      res.status(503).json({ error: 'Database not configured' })
      return
    }

    // Read the CSV file
    const csvContent = fs.readFileSync(req.file.path, 'utf-8')

    // Parse CSV with PapaParse
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim()
    })

    if (parseResult.errors.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path)
      res.status(400).json({
        error: 'CSV parsing error',
        details: parseResult.errors
      })
      return
    }

    const rows = parseResult.data as any[]
    const errors: { row: number; message: string }[] = []
    let created = 0
    let updated = 0

    // Log first row columns for debugging
    if (rows.length > 0) {
      console.log('CSV columns:', Object.keys(rows[0]))
    }

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNumber = i + 2 // +2 because index is 0-based and we have a header row

      try {
        // Validate required fields
        if (!row.SKU || !row.SKU.trim()) {
          errors.push({ row: rowNumber, message: 'SKU is required' })
          continue
        }
        if (!row.Name || !row.Name.trim()) {
          errors.push({ row: rowNumber, message: 'Name is required' })
          continue
        }

        // Parse price from either Price or Est_Retail_Price column (with flexible column name matching)
        let price = 0
        const priceStr = row.Price?.trim() ||
                        row.Est_Retail_Price?.trim() ||
                        row[' Est_Retail_Price ']?.trim() ||
                        row['Est_Retail_Price']?.trim() || ''
        if (priceStr) {
          // Remove $ and extract first number from range (e.g., "$12.00 – $18.00" -> 12.00)
          const priceMatch = priceStr.replace(/\$/g, '').match(/[\d.]+/)
          if (priceMatch) {
            price = parseFloat(priceMatch[0])
          }
        }

        if (!price || isNaN(price)) {
          errors.push({ row: rowNumber, message: 'Valid price is required' })
          continue
        }
        if (!row.Category || !row.Category.trim()) {
          errors.push({ row: rowNumber, message: 'Category is required' })
          continue
        }

        // Collect photo names into images array
        const images: string[] = []
        if (row.Old_Photo_Name && row.Old_Photo_Name.trim()) {
          images.push(row.Old_Photo_Name.trim())
        }
        if (row.New_Photo_Name && row.New_Photo_Name.trim()) {
          images.push(row.New_Photo_Name.trim())
        }

        // Map CSV columns to product schema
        const productData = {
          sku: row.SKU.trim(),
          name: row.Name.trim(),
          description: row.Description?.trim() || '',
          price: price,
          category: row.Category.trim(),
          metal_type: row.Metal?.trim() || '',
          gemstone: '',
          weight: 0,
          images,
          stock_quantity: 0,
          is_featured: false,
          is_bundle: false,
          bundle_discount: 0
        }

        // Check if product exists with this SKU
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('sku', productData.sku)
          .single()

        if (existing) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('sku', productData.sku)

          if (error) throw error
          updated++
        } else {
          // Insert new product
          const { error } = await supabase
            .from('products')
            .insert([productData])

          if (error) throw error
          created++
        }

      } catch (error: any) {
        errors.push({
          row: rowNumber,
          message: error.message || 'Failed to process row'
        })
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path)

    // Return results
    res.json({
      success: true,
      created,
      updated,
      total: created + updated,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    // Clean up file if it exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/stats', async (req, res) => {
  if (useDb) {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true })
    if (error) {
        // Fallback to 0 if table doesn't exist yet
        res.json({ users: 0, products: 0, orders: 0, error: error.message })
        return
    }
    res.json({ users: 0, products: count || 0, orders: 0 })
  } else {
    res.json({ users: 0, products: localProducts.length, orders: 0 })
  }
})

router.get('/products', async (req, res) => {
  if (useDb) {
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    res.json({ items: data })
  } else {
    res.json({ items: localProducts })
  }
})

router.post('/products', async (req, res) => {
  const { name, price, description, stock, images, is_bundle, min_price } = req.body
  
  const errors = validateProduct(req.body)
  if (errors.length > 0) {
    res.status(400).json({ error: errors.join(', ') })
    return
  }

  const productData = {
    name,
    price,
    description: description || '',
    stock: stock || 0,
    images: images || [],
    is_bundle: is_bundle || false,
    min_price
  }

  if (useDb) {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
    
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    res.status(201).json(data)
  } else {
    const newProduct: Product = {
        id: Date.now().toString(),
        ...productData
    }
    localProducts.push(newProduct)
    res.status(201).json(newProduct)
  }
})

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

router.patch('/products/:id', async (req, res) => {
  const { id } = req.params
  
  const errors = validateProduct(req.body, true)
  if (errors.length > 0) {
    res.status(400).json({ error: errors.join(', ') })
    return
  }

  // Sanitize input to only allowed fields
  const allowedFields = ['name', 'price', 'description', 'stock', 'images', 'is_bundle', 'min_price']
  const updates: any = {}
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key]
    }
  })

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: 'No valid fields to update' })
    return
  }

  if (useDb) {
    let query = supabase.from('products').update(updates)
    
    if (isUuid(id)) {
      query = query.eq('id', id)
    } else {
      query = query.eq('sku', id)
    }

    const { data, error } = await query.select().single()
    
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    if (!data) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(data)
  } else {
    const index = localProducts.findIndex(p => p.id === id)
    if (index === -1) {
        res.status(404).json({ error: 'Product not found' })
        return
    }
    
    localProducts[index] = { ...localProducts[index], ...updates }
    res.json(localProducts[index])
  }
})

router.post('/products/:id/generate-description', async (req, res) => {
  try {
    const { id } = req.params
    const options = {
      agentId: req.body?.agentId,
      tone: req.body?.tone,
      language: req.body?.language,
      keywords: req.body?.keywords,
      maxLength: req.body?.maxLength
    }
    let product: any = null
    if (useDb) {
      let query = supabase.from('products').select('*')
      
      if (isUuid(id)) {
        query = query.eq('id', id)
      } else {
        query = query.eq('sku', id)
      }

      const { data, error } = await query.single()
      if (error) {
        res.status(500).json({ error: error.message })
        return
      }
      if (!data) {
        res.status(404).json({ error: 'Product not found' })
        return
      }
      product = data
    } else {
      product = localProducts.find(p => p.id === id)
      if (!product) {
        res.status(404).json({ error: 'Product not found' })
        return
      }
    }

    const aiCfg = await configService.getConfig('ai')
    const description = await generateProductDescription(product, options, aiCfg?.config || null)
    res.json({ description })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/products/:id', async (req, res) => {
    const { id } = req.params

    if (useDb) {
        let query = supabase.from('products').delete()
        
        if (isUuid(id)) {
          query = query.eq('id', id)
        } else {
          query = query.eq('sku', id)
        }

        const { error } = await query
        
        if (error) {
            res.status(500).json({ error: error.message })
            return
        }
        res.json({ success: true })
    } else {
        const initialLength = localProducts.length
        localProducts = localProducts.filter(p => p.id !== id)
        
        if (localProducts.length === initialLength) {
            res.status(404).json({ error: 'Product not found' })
            return
        }
        res.json({ success: true })
    }
})

router.get('/orders', async (req, res) => {
  if (useDb) {
    // Fetch orders sorted by creation date (newest first)
    // Also fetch line item count or details if needed
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.json({ items: data })
  } else {
    // Mock empty list if no DB
    res.json({ items: [] })
  }
})

router.get('/system/info', (req, res) => {
  res.json({ 
      node: process.version, 
      env: process.env.NODE_ENV || 'development',
      db: useDb ? 'connected' : 'not_configured'
  })
})

router.get('/config/:service', async (req, res) => {
  const { service } = req.params
  const config = await configService.getConfig(service)
  if (!config) {
    res.json({ service, config: {}, is_active: false })
    return
  }
  if (service === 'ai' && config.config && typeof config.config === 'object') {
    const masked = { ...config.config }
    if (masked.apiKey) masked.apiKey = '****'
    res.json({ service, config: masked, is_active: config.is_active })
    return
  }
  res.json(config)
})

router.post('/config/:service', async (req, res) => {
  const { service } = req.params
  const { config, is_active } = req.body

  try {
    let toSave = config
    if (service === 'ai') {
      const existing = await configService.getConfig('ai')
      const merged = {
        ...config,
        apiKey: config?.apiKey && config.apiKey !== '****' ? config.apiKey : (existing?.config?.apiKey || '')
      }
      toSave = validateAiConfig(merged)
    }
    const updated = await configService.updateConfig(service, toSave, is_active)
    res.json(updated)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/shopify/sync', async (req, res) => {
  try {
    const configured = await shopifyService.isConfigured()
    if (!configured) {
      res.status(503).json({ error: 'Shopify integration not configured' })
      return
    }
    if (!useDb) {
      res.status(503).json({ error: 'Database not configured' })
      return
    }
    const products = await shopifyService.getProducts()

    // Ensure unique SKUs by using shopify ID if SKU is empty or duplicate
    const seenSkus = new Set<string>()
    const payload = products.map((p: any) => {
      let sku = p.sku || p.id // Use shopify ID if SKU is empty
      // If SKU already seen, append shopify ID to make it unique
      if (seenSkus.has(sku)) {
        sku = p.id
      }
      seenSkus.add(sku)

      return {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        metal_type: p.metal_type,
        gemstone: p.gemstone,
        weight: p.weight,
        images: p.images,
        sku: sku,
        stock_quantity: p.stock_quantity,
        is_featured: p.is_featured,
        is_bundle: p.is_bundle,
        bundle_discount: p.bundle_discount,
      }
    })

    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'sku' })
      .select()
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.json({ count: data?.length || 0 })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/shopify/push/:id', async (req, res) => {
  try {
    const configured = await shopifyService.isConfigured()
    if (!configured) {
      res.status(503).json({ error: 'Shopify integration not configured' })
      return
    }
    if (!useDb) {
      res.status(503).json({ error: 'Database not configured' })
      return
    }
    const { id } = req.params

    let query = supabase.from('products').select('*')
    if (isUuid(id)) {
      query = query.eq('id', id)
    } else {
      query = query.eq('sku', id)
    }

    const { data, error } = await query.single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    if (!data) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    const created = await shopifyService.createProduct({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      images: Array.isArray(data.images) ? data.images : [],
      sku: data.sku,
    })
    res.json({ id: created?.id, title: created?.title })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// Chat settings endpoints
router.get('/settings/chat', async (req, res) => {
  try {
    const config = await configService.getConfig('chat')
    if (!config) {
      res.json({
        propertyId: '',
        widgetId: '',
        enabled: false
      })
      return
    }
    res.json({
      propertyId: config.config?.propertyId || '',
      widgetId: config.config?.widgetId || '',
      enabled: config.is_active || false
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/settings/chat', async (req, res) => {
  try {
    const { propertyId, widgetId, enabled } = req.body

    if (!propertyId || !widgetId) {
      res.status(400).json({ error: 'propertyId and widgetId are required' })
      return
    }

    const updated = await configService.updateConfig(
      'chat',
      { propertyId, widgetId },
      enabled
    )

    res.json({
      propertyId: updated.config?.propertyId || '',
      widgetId: updated.config?.widgetId || '',
      enabled: updated.is_active || false
    })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export const adminRoutes = router
