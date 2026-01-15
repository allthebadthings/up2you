import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, Share2, Star } from 'lucide-react'
import { useCart } from '../store/cart'
import { Product as ProductType } from '../services/products'
import { productService } from '../services/products'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      setLoading(true)
      const data = await productService.getProductById(id)
      setProduct(data)
      setLoading(false)
    }
    loadProduct()
  }, [id])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-neutral-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link to="/catalog" className="text-yellow-600 hover:text-yellow-700">
            Back to catalog
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    const finalPrice = product.is_bundle 
      ? product.price * (1 - product.bundle_discount / 100)
      : product.price

    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      category: product.category,
      metal_type: product.metal_type,
      images: product.images,
      is_bundle: product.is_bundle,
      description: product.description,
      gemstone: product.gemstone
    }, quantity)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/catalog" className="text-gray-600 dark:text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition">
            ← Back to catalog
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-yellow-600' : 'border-gray-200 dark:border-neutral-700'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">{product.name}</h1>
              {product.is_bundle && (
                <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                  Bundle Deal
                </span>
              )}
            </div>

            <div className="space-y-2">
              {product.is_bundle ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-yellow-600">${(product.price * (1 - product.bundle_discount / 100)).toFixed(2)}</span>
                    <span className="text-lg text-gray-400 dark:text-neutral-500 line-through">${product.price}</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded text-sm font-semibold">
                      Save {product.bundle_discount}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Bundle price • Save {product.bundle_discount}%</p>
                </div>
              ) : (
                <div className="text-3xl font-bold text-yellow-600">${product.price}</div>
              )}
              <p className="text-gray-600 dark:text-neutral-400">{product.metal_type}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 dark:text-neutral-400">(4.8) • 127 reviews</span>
            </div>

            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">{product.description}</p>

            {product.is_bundle && (
              <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bundle Details:</h3>
                <p className="text-gray-700 dark:text-neutral-300">{product.description}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">Save {product.bundle_discount}% with this bundle!</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 dark:text-neutral-300 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 dark:border-neutral-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="p-3 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 pt-6 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <p>✓ Free shipping on orders over $200</p>
              <p>✓ 30-day return policy</p>
              <p>✓ Gift packaging included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
