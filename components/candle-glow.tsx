'use client'

import { motion } from 'framer-motion'

interface CandleGlowProps {
  /** Disable the flicker animation (respects reduced motion). */
  still?: boolean
  /** Slightly warmer, brighter glow — used once the letter is open. */
  intense?: boolean
}

/**
 * A warm, candlelit ambience that sits behind the envelope. Two stacked
 * radial pools breathe in and out at different rates so the light reads as a
 * living flame rather than a static gradient. Purely decorative.
 */
export function CandleGlow({ still = false, intense = false }: CandleGlowProps) {
  const flicker = still
    ? { opacity: intense ? 0.85 : 0.7, scale: 1 }
    : {
        // irregular timing between the two keyframes sells the flame flicker
        opacity: intense ? [0.72, 0.92, 0.8, 0.95, 0.78] : [0.58, 0.74, 0.63, 0.78, 0.6],
        scale: [1, 1.03, 0.99, 1.04, 1],
      }

  const transition = still
    ? { duration: 1.2, ease: 'easeInOut' as const }
    : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' as const }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Broad warm wash — the room lit by candlelight */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={flicker}
        transition={transition}
        style={{
          background:
            'radial-gradient(58% 46% at 50% 40%, rgba(255,214,150,0.5) 0%, rgba(240,190,120,0.24) 38%, transparent 72%)',
        }}
      />
      {/* Tighter, brighter core that spotlights the envelope */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={
          still
            ? { opacity: intense ? 0.7 : 0.55, scale: 1 }
            : {
                opacity: intense ? [0.55, 0.78, 0.62, 0.8, 0.58] : [0.42, 0.6, 0.48, 0.62, 0.44],
                scale: [1, 1.05, 1.01, 1.06, 1],
              }
        }
        transition={
          still
            ? { duration: 1.2, ease: 'easeInOut' }
            : { duration: 4.3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background:
            'radial-gradient(34% 30% at 50% 42%, rgba(255,236,196,0.7) 0%, rgba(247,206,132,0.28) 45%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
