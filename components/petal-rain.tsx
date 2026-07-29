'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface PetalRainProps {
  /** Whether petals should be falling (the letter is being read). */
  active: boolean
  /** Maximum number of petals the rain builds up to. */
  count?: number
}

interface Petal {
  id: number
  left: number
  size: number
  sway: number
  duration: number
  spin: number
  spinDir: number
  maxOpacity: number
  depth: number
  hue: [string, string]
}

/* Soft rose gradients drawn from the site's warm theme — each petal is
   tinted from a deeper edge to a paler center so it feels hand-painted and
   catches light as it turns. Ordered deep -> blush. */
const GRADIENTS: [string, string][] = [
  ['#8f2a2e', '#bd565a'],
  ['#a83236', '#cf7773'],
  ['#b8474b', '#dd928b'],
  ['#c76a68', '#e8b0a6'],
  ['#d98f86', '#f0cabf'],
]

/** Build a single petal with organic, randomised properties. */
function buildPetal(id: number): Petal {
  // depth 0 = far (small, soft, slower), 1 = near (large, sharper, a touch faster)
  const depth = Math.random()
  return {
    id,
    left: Math.random() * 100,
    size: 12 + depth * 16 + Math.random() * 4,
    // gentle side-to-side sway (px) — kept small so the petal reads as
    // falling essentially straight down from above, just breathing on a breeze
    sway: 14 + Math.random() * 26,
    // slow, unhurried descent; nearer petals fall only slightly faster
    duration: 22 - depth * 4 + Math.random() * 10,
    spin: 90 + Math.random() * 160,
    spinDir: Math.random() > 0.5 ? 1 : -1,
    maxOpacity: 0.5 + depth * 0.42,
    depth,
    hue: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
  }
}

/** A single rose-petal silhouette with a soft gradient and a center crease. */
function PetalShape({ size, hue }: { size: number; hue: [string, string] }) {
  const gid = `petal-${hue[0].slice(1)}-${hue[1].slice(1)}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="72%" r="72%">
          <stop offset="0%" stopColor={hue[1]} />
          <stop offset="100%" stopColor={hue[0]} />
        </radialGradient>
      </defs>
      {/* single rose petal: pointed at the base, wide and rounded at the top
          (no top notch, so it never reads as a heart) */}
      <path
        d="M16 31 C7 26 3 18 4 11 C5 5 10 2 16 2 C22 2 27 5 28 11 C29 18 25 26 16 31 Z"
        fill={`url(#${gid})`}
      />
      {/* center crease for a folded, three-dimensional feel */}
      <path
        d="M16 6 C15 13 15 21 16 30"
        fill="none"
        stroke={hue[0]}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

/** One petal that falls from above the viewport straight down to below it. */
function FallingPetal({ p }: { p: Petal }) {
  return (
    <motion.div
      className="absolute top-0"
      style={{ left: `${p.left}vw`, willChange: 'transform' }}
      // start fully above the screen so the petal enters from the top edge
      // rather than popping into existence mid-air
      initial={{ y: '-20vh', x: 0, opacity: 0 }}
      animate={{
        y: '120vh',
        // gentle breeze sway around the vertical fall line
        x: [0, p.sway, -p.sway * 0.7, p.sway * 0.4, 0],
        // fade in quickly while still above the fold, hold, fade out near the floor
        opacity: [0, p.maxOpacity, p.maxOpacity, p.maxOpacity, 0],
      }}
      transition={{
        y: { duration: p.duration, repeat: Infinity, ease: 'linear' },
        x: {
          duration: p.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
        },
        opacity: {
          duration: p.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.06, 0.5, 0.9, 1],
        },
      }}
    >
      {/* Slow tumble as it drifts down. */}
      <motion.div
        style={{ willChange: 'transform' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: p.spin * p.spinDir }}
        transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}
      >
        {/* Soft 3D flutter — the petal tilts as it falls and catches light. */}
        <motion.div
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: [0, 60, -40, 30, 0] }}
          transition={{
            duration: p.duration * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            style={{
              filter:
                p.depth < 0.35
                  ? `blur(${(0.35 - p.depth) * 4}px) drop-shadow(0 1px 1px rgba(90,20,24,0.25))`
                  : 'drop-shadow(0 2px 2px rgba(90,20,24,0.3))',
            }}
          >
            <PetalShape size={p.size} hue={p.hue} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/**
 * A slow rain of rose petals drifting down over the letter as it's read.
 * Petals enter from above the viewport and fall essentially straight down
 * with a gentle breeze sway, and the rain gradually builds up from a few
 * petals to a full, steady fall. Purely decorative.
 */
export function PetalRain({ active, count = 40 }: PetalRainProps) {
  // Positions rely on Math.random(), so generate on the client only to
  // avoid a server/client hydration mismatch.
  const [petals, setPetals] = useState<Petal[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setPetals([])
      return
    }

    // Gradually add petals so the rain thickens over time instead of
    // appearing all at once.
    let current = 0
    setPetals([])

    const addOne = () => {
      current += 1
      setPetals((prev) => [...prev, buildPetal(current)])
      if (current < count) {
        timerRef.current = setTimeout(addOne, 320)
      }
    }
    addOne()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, count])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      style={{ perspective: '700px' }}
    >
      {petals.map((p) => (
        <FallingPetal key={p.id} p={p} />
      ))}
    </div>
  )
}
