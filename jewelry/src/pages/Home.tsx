import { Link } from 'react-router-dom'
import { Sparkles, Gift } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Product } from '../services/products'
import { productService } from '../services/products'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bundles, setBundles] = useState<Product[]>([])

  useEffect(() => {
    loadFeaturedProducts()
    loadBundles()
  }, [])

  const loadFeaturedProducts = async () => {
    const data = await productService.getFeaturedProducts()
    setFeaturedProducts(data)
  }

  const loadBundles = async () => {
    const data = await productService.getBundleProducts()
    setBundles(data)
  }
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 dark:text-white mb-6">
              Timeless Elegance
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of premium jewelry, crafted with passion and designed to last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalog" 
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition shadow-lg"
              >
                Shop Collection
              </Link>
              <Link 
                to="/bundles" 
                className="border-2 border-yellow-600 text-yellow-600 dark:text-yellow-500 dark:border-yellow-500 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 dark:hover:bg-neutral-800 transition"
              >
                View Bundles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-background-dark transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 dark:text-white mb-4">Featured Pieces</h2>
            <p className="text-gray-600 dark:text-gray-400">Handpicked selections from our latest collection</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.metal_type}</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">${product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Offers */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 dark:text-white mb-4">Curated Bundles</h2>
            <p className="text-gray-600 dark:text-gray-400">Save more when you buy our expertly crafted jewelry sets</p>
          </div>
          <div className="max-w-4xl mx-auto">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-yellow-200 dark:border-neutral-700 transition-colors duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">{bundle.name}</h3>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">${(bundle.price * (1 - bundle.bundle_discount / 100)).toFixed(2)}</span>
                    <span className="text-lg text-gray-400 line-through">${bundle.price}</span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      Save {bundle.bundle_discount}%
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{bundle.description}</p>
                </div>
                <div className="text-center">
                  <Link 
                    to={`/product/${bundle.id}`}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition inline-block"
                  >
                    View Bundle Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-background-dark transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Sparkles className="w-12 h-12 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">Each piece is carefully crafted using the finest materials and attention to detail.</p>
            </div>
            <div className="p-6">
              <Gift className="w-12 h-12 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Perfect Gifts</h3>
              <p className="text-gray-600 dark:text-gray-400">Beautifully packaged and ready to gift for any special occasion.</p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  )
}
