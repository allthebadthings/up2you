import { Link } from 'react-router-dom'
import { Flame, ArrowLeft, Wrench } from 'lucide-react'
import { colors } from '../lib/design-tokens'

export default function BreakTheChains() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
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
                background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonLight})`
              }}
            >
              <Flame className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Break the Chains
          </h1>

          <p
            className="text-xl mb-4 italic"
            style={{ color: colors.up2you.crimsonLight }}
          >
            For the Bold
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white text-lg mb-6">
              Take complete control. Build your own custom body jewelry, chain vests, crossbody pieces, and more.
            </p>

            <div
              className="bg-gradient-to-br from-neutral-900 to-black rounded-xl p-8 border-2"
              style={{ borderColor: colors.up2you.crimson }}
            >
              <div className="mb-6">
                <Wrench className="w-12 h-12 mx-auto mb-4" style={{ color: colors.up2you.gold }} />
                <h2 className="text-2xl font-bold text-white mb-4">Interactive Builder Coming Soon</h2>
              </div>

              <p className="text-white/70 mb-6">
                We're crafting an immersive customization experience where you'll have full control over every detail.
              </p>

              <div className="space-y-3 text-left text-white/60 mb-8">
                <p>✓ Step-by-step builder wizard</p>
                <p>✓ Choose base chains, charms, and pendants</p>
                <p>✓ Customize length and fit</p>
                <p>✓ Real-time price calculator</p>
                <p>✓ Visual preview of your design</p>
                <p>✓ Submit for custom creation</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/70 text-sm">
                  <strong className="text-white">What you'll build:</strong>
                </p>
                <ul className="text-white/60 text-sm mt-2 space-y-1">
                  <li>• Body chain vests</li>
                  <li>• Crossbody chains</li>
                  <li>• Hat & hair wraps</li>
                  <li>• Statement overlay pieces</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing info */}
          <div className="mb-8">
            <p className="text-white/50 text-sm mb-2">Estimated Pricing Range</p>
            <p
              className="text-3xl font-bold"
              style={{ color: colors.up2you.crimsonLight }}
            >
              $89 - $500+
            </p>
            <p className="text-white/40 text-sm mt-2">Based on components and customization</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="px-8 py-3 rounded-lg font-semibold text-white transition"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
              }}
            >
              Browse Ready-Made Pieces
            </Link>

            <Link
              to="/"
              className="px-8 py-3 rounded-lg font-semibold transition"
              style={{
                border: `2px solid ${colors.up2you.crimson}`,
                color: colors.up2you.crimson
              }}
            >
              Explore Other Paths
            </Link>
          </div>

          {/* Notify section */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-4">
              Be the first to know when the builder launches
            </p>
            <p className="text-white/50 text-sm">
              This is our most ambitious project yet. Stay tuned for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
