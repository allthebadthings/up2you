import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../store/cart'
import { Product } from '../services/products'
import { productService } from '../services/products'

const PAGE_SIZE = 15

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const { addItem } = useCart()

  const categories = ['all', 'rings', 'necklaces', 'earrings', 'bracelets']

  const loadProducts = useCallback(async (page: number, filters: any, initialLoad: boolean) => {
    setIsLoading(true)
    
    // Paginate only Supabase products
    const { data: supabaseProducts, count } = await productService.getProducts({ ...filters, page, limit: PAGE_SIZE })
    
    let allProducts = supabaseProducts
    
    // For the first page load, also fetch from other sources
    if (initialLoad) {
      const shopifyProducts = await productService.getShopifyProducts()
      const ebayProducts = await productService.getEbayProducts('jewelry')
      allProducts = [...supabaseProducts, ...shopifyProducts, ...ebayProducts]
    }

    setProducts(prevProducts => page === 1 ? allProducts : [...prevProducts, ...allProducts]);
    setTotalProducts(count)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const filters = {
      category: selectedCategory,
      min_price: priceRange[0],
      max_price: priceRange[1],
      search: searchTerm,
    }
    // Reset to page 1 and do an initial load when filters change
    setCurrentPage(1)
    loadProducts(1, filters, true)
  }, [selectedCategory, priceRange, searchTerm, loadProducts])

  useEffect(() => {
    // This effect handles fetching for pagination (pages > 1)
    if (currentPage > 1) {
      const filters = {
        category: selectedCategory,
        min_price: priceRange[0],
        max_price: priceRange[1],
        search: searchTerm,
      }
      loadProducts(currentPage, filters, false)
    }
  }, [currentPage, loadProducts])

  const handleLoadMore = () => {
    if (!isLoading && products.length < totalProducts) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-4 md:mb-0">Jewelry Collection</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm mb-8 border border-gray-200 dark:border-neutral-700">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {products.length} of {totalProducts} pieces from main collection
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-yellow-600 dark:hover:text-yellow-500 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.metal_type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{product.gemstone}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.is_bundle ? (
                      <>
                        <span className="text-xl font-bold text-yellow-600 dark:text-yellow-500">
                          ${(product.price * (1 - product.bundle_discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-yellow-600 dark:text-yellow-500">${product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
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
                        description: product.description
                      })
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setPriceRange([0, 500])
                setSearchTerm('')
              }}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          {isLoading && <p>Loading...</p>}
          {!isLoading && products.length < totalProducts && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
