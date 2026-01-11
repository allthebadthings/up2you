import { X, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../lib/design-tokens'

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RewardModal({ isOpen, onClose }: RewardModalProps) {
  const [copied, setCopied] = useState(false)
  const couponCode = 'BEBOLD25'

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Track analytics
    if (window.gtag) {
      window.gtag('event', 'coupon_code_copied', {
        event_category: 'conversion',
        event_label: couponCode
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-gradient-to-br from-neutral-900 to-black rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        style={{
          border: `2px solid ${colors.up2you.gold}`
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success icon */}
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
              }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: colors.up2you.gold }}
          >
            You're Bold!
          </h2>

          <p className="text-white/90 text-lg mb-6">
            Here's your reward for taking the leap
          </p>

          {/* Coupon code */}
          <div className="mb-6">
            <div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-dashed"
              style={{ borderColor: colors.up2you.gold }}
            >
              <p className="text-white/70 text-sm mb-2">Your Coupon Code</p>
              <div className="flex items-center justify-center gap-3">
                <span
                  className="text-3xl font-bold tracking-wider"
                  style={{ color: colors.up2you.gold }}
                >
                  {couponCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  title="Copy code"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70" />
                  )}
                </button>
              </div>
              <p className="text-white/90 text-2xl font-semibold mt-3">
                25% OFF
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/70 text-sm mb-6">
            Use this code at checkout to get 25% off your order.
            Ready to create something extraordinary?
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/break-the-chains"
              className="px-6 py-3 rounded-lg font-semibold text-white transition transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
              }}
              onClick={onClose}
            >
              Break the Chains
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold transition"
              style={{
                border: `2px solid ${colors.up2you.gold}`,
                color: colors.up2you.gold
              }}
            >
              Keep Exploring
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{ background: colors.up2you.gold }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
          <div
            className="w-full h-full rounded-full blur-3xl"
            style={{ background: colors.up2you.crimson }}
          />
        </div>
      </div>
    </div>
  )
}
