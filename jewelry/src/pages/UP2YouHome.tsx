import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { colors } from '../lib/design-tokens'
import { Product, productService } from '../services/products'
import { useCart } from '../store/cart'
import ImpulseTile from '../components/up2you/ImpulseTile'
import RewardModal from '../components/up2you/RewardModal'
import PathSelection from '../components/up2you/PathSelection'

export default function UP2YouHome() {
  const [products, setProducts] = useState<Product[]>([])
  const [showRewardModal, setShowRewardModal] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    // Load more products initially so we can filter for working images
    const { data } = await productService.getProducts({ limit: 50 })

    // Filter and sort products - prioritize those with valid images
    const productsWithImages = data.filter(p =>
      p.images &&
      Array.isArray(p.images) &&
      p.images.length > 0 &&
      p.images[0] &&
      p.images[0].trim() !== ''
    )

    const productsWithoutImages = data.filter(p =>
      !p.images ||
      !Array.isArray(p.images) ||
      p.images.length === 0 ||
      !p.images[0] ||
      p.images[0].trim() === ''
    )

    // Show products with images first, then ones without (take first 11 total)
    const sortedProducts = [...productsWithImages, ...productsWithoutImages].slice(0, 11)
    setProducts(sortedProducts)
  }

  const handleImpulseClick = () => {
    setShowRewardModal(true)
  }

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.up2you.crimsonDark}20 0%, ${colors.up2you.black} 70%)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
            style={{
              background: `linear-gradient(135deg, ${colors.up2you.gold}, ${colors.up2you.crimson})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Your Style. Your Story.
          </h1>

          <p
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: colors.up2you.gold }}
          >
            UP2YOU.
          </p>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Not just jewelry. An experience. A journey. A statement.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 opacity-20">
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{ background: colors.up2you.gold }}
          />
        </div>
        <div className="absolute bottom-10 right-10 w-64 h-64 opacity-20">
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{ background: colors.up2you.crimson }}
          />
        </div>
      </section>

      {/* Engagement Banner */}
      <section className="py-12 bg-gradient-to-r from-neutral-900 to-black border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            What does your story say?
          </h2>
          <p className="text-white/60">
            Every piece tells a story. Make yours unforgettable.
          </p>
        </div>
      </section>

      {/* Product Grid with Impulse Tile */}
      <section className="py-20 bg-gradient-to-b from-black to-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Collection
            </h2>
            <p className="text-white/60">
              Hand-curated pieces waiting to become part of your story
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} addItem={addItem} />
            ))}

            {/* Impulse Tile - strategically placed */}
            <ImpulseTile onFirstClick={handleImpulseClick} />

            {products.slice(5, 11).map((product) => (
              <ProductCard key={product.id} product={product} addItem={addItem} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="inline-block px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.gold}, ${colors.up2you.goldDark})`,
                color: colors.up2you.black
              }}
            >
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Path Selection */}
      <PathSelection />

      {/* Reward Modal */}
      <RewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
      />
    </div>
  )
}

// Product Card Component
function ProductCard({ product, addItem }: { product: Product; addItem: any }) {
  return (
    <div className="group bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-neutral-800 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-semibold mb-1 group-hover:text-yellow-500 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-white/60 text-sm mb-3 line-clamp-1">
          {product.metal_type || product.category}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{ color: colors.up2you.gold }}
          >
            ${product.price}
          </span>

          <button
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                metal_type: product.metal_type,
                images: product.images,
                is_bundle: product.is_bundle,
                description: product.description
              })
            }}
            className="p-2 rounded-lg transition hover:bg-neutral-800"
          >
            <ShoppingBag className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
