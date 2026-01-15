import { Link } from 'react-router-dom'
import { Heart, Sparkles, Flame } from 'lucide-react'
import { colors } from '../../lib/design-tokens'

export default function PathSelection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.up2you.gold }}
          >
            Where Are You Going?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every journey is unique. Choose the path that speaks to your soul.
          </p>
        </div>

        {/* Three Paths */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Path 1: Simple Statements */}
          <Link
            to="/simple-statements"
            className="group relative overflow-hidden rounded-2xl bg-neutral-800 border-2 border-neutral-700 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Simple Statements
              </h3>

              <p className="text-neutral-400 text-sm mb-2 italic">
                For the Shy
              </p>

              <p className="text-white/70 mb-6">
                Curated bundles of timeless pieces. Let our experts guide you to elegance.
              </p>

              <div className="space-y-2 text-sm text-white/60">
                <p>✓ Expert curation</p>
                <p>✓ Classic combinations</p>
                <p>✓ Trusted quality</p>
              </div>

              <div className="mt-6 text-neutral-400 text-sm">
                $120 - $300
              </div>

              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium group-hover:bg-white/20 transition">
                  Explore →
                </span>
              </div>
            </div>
          </Link>

          {/* Path 2: Reinvent Yourself */}
          <Link
            to="/reinvent-yourself"
            className="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors.up2you.charcoal}, ${colors.up2you.softBlack})`,
              borderColor: colors.up2you.gold
            }}
          >
            <div className="p-8 text-center">
              <div className="mb-6">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.up2you.gold}, ${colors.up2you.goldDark})`
                  }}
                >
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Reinvent Yourself
              </h3>

              <p className="text-sm mb-2 italic" style={{ color: colors.up2you.gold }}>
                For the Ready
              </p>

              <p className="text-white/70 mb-6">
                One-of-a-kind blended looks. Never exactly the same twice. Trust Kim's artistic vision.
              </p>

              <div className="space-y-2 text-sm text-white/60">
                <p>✓ Unique combinations</p>
                <p>✓ Vintage + modern mix</p>
                <p>✓ Fresh weekly drops</p>
              </div>

              <div className="mt-6 text-sm" style={{ color: colors.up2you.gold }}>
                $150 - $400
              </div>

              <div className="mt-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-black text-sm font-medium transition"
                  style={{ background: colors.up2you.gold }}
                >
                  Discover →
                </span>
              </div>
            </div>

            {/* Featured badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                Popular
              </span>
            </div>
          </Link>

          {/* Path 3: Break the Chains */}
          <Link
            to="/break-the-chains"
            className="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors.up2you.crimsonDark}, ${colors.up2you.black})`,
              borderColor: colors.up2you.crimson
            }}
          >
            <div className="p-8 text-center">
              <div className="mb-6">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonLight})`
                  }}
                >
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Break the Chains
              </h3>

              <p
                className="text-sm mb-2 italic"
                style={{ color: colors.up2you.crimsonLight }}
              >
                For the Bold
              </p>

              <p className="text-white/70 mb-6">
                Full control. Build your own body jewelry, chain vests, and crossbody pieces.
              </p>

              <div className="space-y-2 text-sm text-white/60">
                <p>✓ Interactive builder</p>
                <p>✓ Complete customization</p>
                <p>✓ Real-time pricing</p>
              </div>

              <div
                className="mt-6 text-sm"
                style={{ color: colors.up2you.crimsonLight }}
              >
                $89 - $500+
              </div>

              <div className="mt-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium transition"
                  style={{ background: colors.up2you.crimson }}
                >
                  Build Now →
                </span>
              </div>
            </div>

            {/* Flame effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${colors.up2you.crimsonLight}, transparent)`
                }}
              />
            </div>
          </Link>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-white/50 text-sm">
            Not sure yet?{' '}
            <Link
              to="/catalog"
              className="underline hover:text-white transition"
              style={{ color: colors.up2you.gold }}
            >
              Browse our full catalog
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
