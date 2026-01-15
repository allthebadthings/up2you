import { Upload, Image, Package, ExternalLink } from 'lucide-react'

export default function AdminTools() {
  // Use window.location to determine the correct base URL
  const getToolUrl = (filename: string) => {
    // In development, use the backend port directly
    // In production, use relative paths (same domain)
    const isDev = window.location.hostname === 'localhost'
    const baseUrl = isDev ? 'http://localhost:3000' : ''
    return `${baseUrl}/tools/${filename}`
  }

  const tools = [
    {
      name: 'Image Uploader',
      description: 'Upload jewelry photos and get Imgur URLs instantly for your inventory',
      icon: Upload,
      url: getToolUrl('Jewelry_Image_Uploader.html'),
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Photo Studio',
      description: 'Transform raw photos into professional product images with styled backgrounds',
      icon: Image,
      url: getToolUrl('Product_Photo_Studio.html'),
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Bundle Builder',
      description: 'Create custom bundles and generate professional marketing images',
      icon: Package,
      url: getToolUrl('Bundle_Builder.html'),
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Business Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Helpful utilities for managing your jewelry inventory and creating marketing materials
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${tool.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {tool.name}
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition" />
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>

              <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-500 font-medium">
                Open Tool →
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-3">
          💡 How to Use These Tools
        </h2>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li><strong>Image Uploader:</strong> Drag photos, get URLs, paste in Excel</li>
          <li><strong>Photo Studio:</strong> Upload raw photo → Pick style → Download professional image</li>
          <li><strong>Bundle Builder:</strong> Upload your inventory file → Drag items → Generate bundle image</li>
        </ul>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-4">
          All tools open in a new tab and work independently. No setup required!
        </p>
      </div>
    </div>
  )
}
