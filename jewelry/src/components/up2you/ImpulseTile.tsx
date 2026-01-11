import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { colors } from '../../lib/design-tokens'

interface ImpulseTileProps {
  onFirstClick: () => void
}

export default function ImpulseTile({ onFirstClick }: ImpulseTileProps) {
  const [hasClicked, setHasClicked] = useState(false)
  const [isGlowing, setIsGlowing] = useState(true)

  useEffect(() => {
    // Check if user has clicked before
    const clicked = localStorage.getItem('up2you_impulse_clicked')
    if (clicked) {
      setHasClicked(true)
      setIsGlowing(false)
    }

    // Pulse animation
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (!hasClicked) {
      localStorage.setItem('up2you_impulse_clicked', 'true')
      setHasClicked(true)
      onFirstClick()

      // Track analytics
      if (window.gtag) {
        window.gtag('event', 'impulse_tile_first_click', {
          event_category: 'engagement',
          event_label: 'first_time_reward'
        })
      }
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        relative overflow-hidden cursor-pointer
        bg-gradient-to-br from-[${colors.up2you.crimson}] to-[${colors.up2you.crimsonDark}]
        rounded-lg shadow-xl
        transition-all duration-300 transform
        hover:scale-105 hover:shadow-2xl
        ${isGlowing && !hasClicked ? 'animate-pulse' : ''}
      `}
      style={{
        background: `linear-gradient(135deg, ${colors.up2you.crimson} 0%, ${colors.up2you.crimsonDark} 100%)`,
        boxShadow: isGlowing && !hasClicked
          ? `0 0 30px ${colors.up2you.crimsonLight}`
          : undefined
      }}
    >
      {/* Sparkle effect overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 right-2">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="mb-3">
          <Sparkles className="w-12 h-12 text-white mx-auto" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {hasClicked ? 'Bold Choice!' : 'Are you impulsive?'}
        </h3>

        <p className="text-white/90 text-sm font-medium">
          {hasClicked ? 'Keep exploring' : 'Dare to try?'}
        </p>

        {!hasClicked && (
          <div className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs font-semibold">Click me</span>
          </div>
        )}
      </div>

      {/* Glow effect for first-time users */}
      {!hasClicked && (
        <div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            background: `radial-gradient(circle at center, ${colors.up2you.gold}40 0%, transparent 70%)`
          }}
        />
      )}
    </div>
  )
}
