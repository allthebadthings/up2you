/* minimal integration test for AI description endpoint */
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'devtoken'

const headers = {
  'x-admin-token': ADMIN_TOKEN,
  'Content-Type': 'application/json'
}

const run = async () => {
  const base = process.env.BASE_URL || 'http://localhost:3000'

  // Create a product
  const createRes = await fetch(`${base}/api/admin/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Silver Pendant Necklace',
      price: 129.99,
      stock: 20,
      category: 'Necklaces',
      metal_type: 'Sterling Silver',
      gemstone: 'Cubic Zirconia',
      images: []
    })
  })
  const created = await createRes.json()
  if (!createRes.ok) {
    console.error('Create failed:', created)
    process.exit(1)
  }
  console.log('Created product id:', created.id)

  // Generate description
  const genRes = await fetch(`${base}/api/admin/products/${created.id}/generate-description`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tone: 'neutral',
      language: 'en',
      keywords: ['silver', 'pendant', 'gift']
    })
  })
  const gen = await genRes.json()
  if (!genRes.ok) {
    console.error('Generate failed:', gen)
    process.exit(1)
  }
  console.log('Generated description:', gen.description)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

