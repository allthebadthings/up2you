import { useEffect, useState, useMemo } from 'react'
import { Button, Input, Card } from '../../components/ui'

const ITEMS_PER_PAGE = 20

type SortField = 'name' | 'price' | 'stock_quantity' | 'category' | 'created_at'
type SortDirection = 'asc' | 'desc'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [quickPrice, setQuickPrice] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    metal_type: '',
    gemstone: '',
    images: [] as string[]
  })
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingCsv, setUploadingCsv] = useState(false)
  const [csvResults, setCsvResults] = useState<any>(null)
  const [uploadingBulkImages, setUploadingBulkImages] = useState(false)
  const [bulkImageResults, setBulkImageResults] = useState<any>(null)

  const headers = {
    'x-admin-token': localStorage.getItem('admin_token') || '',
    'Content-Type': 'application/json'
  }

  const fetchProducts = () => {
    fetch('/api/admin/products', { headers })
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Sort and paginate products
  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      // Handle null/undefined
      if (aVal == null) aVal = ''
      if (bVal == null) bVal = ''

      // Handle strings
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [products, sortField, sortDirection])

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when sort changes
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('admin_token') || ''
        },
        body: formDataUpload
      })
      const data = await res.json()
      if (data.url) {
        setFormData({...formData, images: [...formData.images, data.url]})
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData({...formData, images: [...formData.images, imageUrl.trim()]})
      setImageUrl('')
    }
  }

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCsv(true)
    setCsvResults(null)

    const formDataUpload = new FormData()
    formDataUpload.append('csv', file)

    try {
      const res = await fetch('/api/admin/products/csv-upload', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('admin_token') || ''
        },
        body: formDataUpload
      })
      const data = await res.json()

      if (res.ok) {
        setCsvResults(data)
        fetchProducts()
      } else {
        setCsvResults({ error: data.error || 'Failed to upload CSV' })
      }
    } catch (err) {
      console.error('CSV upload failed:', err)
      setCsvResults({ error: 'Network error: Failed to upload CSV' })
    } finally {
      setUploadingCsv(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingBulkImages(true)
    setBulkImageResults(null)

    const formDataUpload = new FormData()
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append('images', files[i])
    }

    try {
      const res = await fetch('/api/admin/products/bulk-image-upload', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('admin_token') || ''
        },
        body: formDataUpload
      })
      const data = await res.json()

      if (res.ok) {
        setBulkImageResults(data)
        fetchProducts()
      } else {
        setBulkImageResults({ error: data.error || 'Failed to upload images' })
      }
    } catch (err) {
      console.error('Bulk image upload failed:', err)
      setBulkImageResults({ error: 'Network error: Failed to upload images' })
    } finally {
      setUploadingBulkImages(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({...formData, images: newImages})
  }

  const startQuickPriceEdit = (productId: string, currentPrice: number) => {
    setEditingPriceId(productId)
    setQuickPrice(String(currentPrice))
  }

  const saveQuickPrice = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ price: Number(quickPrice) })
      })
      if (res.ok) {
        setEditingPriceId(null)
        setQuickPrice('')
        fetchProducts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const cancelQuickPriceEdit = () => {
    setEditingPriceId(null)
    setQuickPrice('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing 
      ? `/api/admin/products/${editing.id}`
      : '/api/admin/products'
    
    const method = editing ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity)
        })
      })

      if (res.ok) {
        setEditing(null)
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          metal_type: '',
          gemstone: '',
          images: []
        })
        setImageUrl('')
        fetchProducts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (p: any) => {
    setEditing(p)
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock_quantity: p.stock_quantity,
      category: p.category || '',
      metal_type: p.metal_type || '',
      gemstone: p.gemstone || '',
      images: p.images || []
    })
    setImageUrl('')
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Products <span className="text-sm font-normal text-gray-500">({products.length} total)</span>
        </h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                setLoading(true)
                const res = await fetch('/api/admin/shopify/sync', {
                  method: 'POST',
                  headers
                })
                const data = await res.json()
                setLoading(false)
                fetchProducts()
                alert(`Synced ${data.count || 0} products from Shopify`)
              } catch {
                setLoading(false)
              }
            }}
          >
            Pull Shopify Data
          </Button>
          <label className="inline-flex items-center px-6 py-3 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-neutral-300 dark:focus:ring-neutral-600 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              disabled={uploadingCsv}
            />
            {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
          </label>
          <label className="inline-flex items-center px-6 py-3 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-neutral-300 dark:focus:ring-neutral-600 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkImageUpload}
              className="hidden"
              disabled={uploadingBulkImages}
            />
            {uploadingBulkImages ? 'Uploading...' : 'Bulk Upload Images'}
          </label>
          <Button onClick={() => setEditing({})}>Add Product</Button>
        </div>
      </div>

      {/* CSV Upload Results */}
      {csvResults && (
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {csvResults.error ? (
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-semibold">CSV Upload Failed</p>
                  <p className="text-sm mt-1">{csvResults.error}</p>
                </div>
              ) : (
                <div className="text-green-600 dark:text-green-400">
                  <p className="font-semibold">CSV Upload Successful</p>
                  <p className="text-sm mt-1">
                    Created: {csvResults.created || 0}, Updated: {csvResults.updated || 0}, Total: {csvResults.total || 0}
                  </p>
                  {csvResults.errors && csvResults.errors.length > 0 && (
                    <div className="mt-3 text-amber-600 dark:text-amber-400">
                      <p className="font-semibold text-sm">Errors ({csvResults.errors.length}):</p>
                      <ul className="text-xs mt-1 space-y-1 max-h-40 overflow-y-auto">
                        {csvResults.errors.map((err: any, idx: number) => (
                          <li key={idx}>Row {err.row}: {err.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setCsvResults(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* Bulk Image Upload Results */}
      {bulkImageResults && (
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {bulkImageResults.error ? (
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-semibold">Bulk Image Upload Failed</p>
                  <p className="text-sm mt-1">{bulkImageResults.error}</p>
                </div>
              ) : (
                <div className="text-green-600 dark:text-green-400">
                  <p className="font-semibold">Bulk Image Upload Successful</p>
                  <p className="text-sm mt-1">
                    Uploaded: {bulkImageResults.uploaded || 0}, Matched: {bulkImageResults.matched || 0}
                  </p>
                  {bulkImageResults.unmatched && bulkImageResults.unmatched.length > 0 && (
                    <div className="mt-3 text-amber-600 dark:text-amber-400">
                      <p className="font-semibold text-sm">Unmatched files ({bulkImageResults.unmatched.length}):</p>
                      <ul className="text-xs mt-1 space-y-1 max-h-40 overflow-y-auto">
                        {bulkImageResults.unmatched.map((filename: string, idx: number) => (
                          <li key={idx}>{filename}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setBulkImageResults(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
        {[
          { field: 'name' as SortField, label: 'Name' },
          { field: 'price' as SortField, label: 'Price' },
          { field: 'stock_quantity' as SortField, label: 'Stock' },
          { field: 'category' as SortField, label: 'Category' },
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => handleSortChange(field)}
            className={`px-3 py-1 rounded ${
              sortField === field
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
            }`}
          >
            {label}
            {sortField === field && (
              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {(editing !== null) && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{editing.id ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                value={formData.price}
                onChange={(value) => setFormData({...formData, price: value})}
                required
              />
              <Input
                label="Stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(value) => setFormData({...formData, stock_quantity: value})}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Category"
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
              />
              <Input
                label="Metal"
                value={formData.metal_type}
                onChange={(value) => setFormData({...formData, metal_type: value})}
              />
              <Input
                label="Gemstone"
                value={formData.gemstone}
                onChange={(value) => setFormData({...formData, gemstone: value})}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Images</label>

              {/* Current Images */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload from computer */}
              <div>
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? 'Uploading...' : '📤 Upload Image'}
                </label>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Max 5MB)</span>
              </div>

              {/* Add image URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-700 dark:text-white"
                />
                <Button type="button" variant="secondary" onClick={handleAddImageUrl} disabled={!imageUrl.trim()}>
                  Add URL
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-md border border-gray-200 dark:border-neutral-700">
        <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
          {paginatedProducts.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                {/* Product thumbnail */}
                {product.images && product.images.length > 0 && (
                  <div className="mr-4 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-neutral-700"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 dark:text-indigo-400 truncate">{product.name}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {editingPriceId === product.id ? (
                          <div className="flex items-center gap-1">
                            <span>$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={quickPrice}
                              onChange={(e) => setQuickPrice(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded text-sm dark:bg-neutral-700 dark:text-white"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveQuickPrice(product.id)
                                if (e.key === 'Escape') cancelQuickPriceEdit()
                              }}
                            />
                            <button
                              onClick={() => saveQuickPrice(product.id)}
                              className="text-green-600 hover:text-green-700 font-bold"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelQuickPriceEdit}
                              className="text-red-600 hover:text-red-700 font-bold"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <p>
                            <button
                              onClick={() => startQuickPriceEdit(product.id, product.price)}
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
                              title="Click to edit price"
                            >
                              ${product.price}
                            </button>
                            {' • Stock: '}{product.stock_quantity}
                            {product.images && product.images.length > 0 && (
                              <span className="ml-2">• {product.images.length} image{product.images.length > 1 ? 's' : ''}</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/admin/shopify/push/${product.id}`, {
                          method: 'POST',
                          headers
                        })
                        const data = await res.json()
                        alert(data.id ? `Pushed to Shopify: ${data.title || data.id}` : 'Failed to push to Shopify')
                      } catch (err) {
                        alert('Error pushing to Shopify')
                      }
                    }}
                  >
                    Push ⬆️
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => startEdit(product)}>Edit</Button>
                  <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={() => handleDelete(product.id)}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-neutral-800 px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-md">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
