import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { colors } from '../lib/design-tokens'

export default function ReinventYourself() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Content */}
        <div className="text-center">
          <div className="mb-8">
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.gold}, ${colors.up2you.goldDark})`
              }}
            >
              <Sparkles className="w-12 h-12 text-black" />
            </div>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: colors.up2you.gold }}
          >
            Reinvent Yourself
          </h1>

          <p className="text-white/70 text-xl mb-4 italic">
            For the Ready
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white text-lg mb-6">
              One-of-a-kind blended looks. Kim creates unique combinations you won't find anywhere else.
            </p>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-white/70 mb-6">
                Kim is curating exclusive pieces that blend vintage and modern styles.
                Each piece tells a unique story and is available for a limited time only.
              </p>

              <div className="space-y-3 text-left text-white/60">
                <p>✓ Vintage + modern combinations</p>
                <p>✓ Fresh drops every week</p>
                <p>✓ Never the same twice</p>
                <p>✓ Kim's creative vision</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="px-8 py-3 rounded-lg font-semibold transition"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.gold}, ${colors.up2you.goldDark})`,
                color: colors.up2you.black
              }}
            >
              Browse Catalog
            </Link>

            <Link
              to="/"
              className="px-8 py-3 rounded-lg font-semibold transition"
              style={{
                border: `2px solid ${colors.up2you.gold}`,
                color: colors.up2you.gold
              }}
            >
              Explore Other Paths
            </Link>
          </div>

          {/* Notify section */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-4">
              Want to be notified when this launches?
            </p>
            <p className="text-white/50 text-sm">
              Check back soon or follow us on social media for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
