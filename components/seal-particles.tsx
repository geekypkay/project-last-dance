'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface SealParticlesProps {
  active: boolean
  count?: number
  /** Delay (s) before the dust settles — synced to the seal's crumble. */
  delay?: number
}

/**
 * A soft fall of fine wax dust released once the fractured seal gives way.
 * Deterministic per-particle vectors are generated once via useMemo.
 */
export function SealParticles({ active, count = 16, delay = 0 }: SealParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const distance = 24 + Math.random() * 44
        return {
          id: i,
          x: Math.cos(angle) * distance * 0.7,
          y: Math.sin(angle) * distance + 46, // bias downward, gentle gravity
          size: 2 + Math.random() * 3.5,
          delay: delay + Math.random() * 0.25,
          shade: Math.random() > 0.5 ? '#8b2e33' : '#6f2126',
        }
      }),
    [count, delay],
  )

  if (!active) return null

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-40"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.shade,
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, 0.9, 0],
            scale: 0.3,
            rotate: p.x * 2,
          }}
          transition={{
            duration: 1.3,
            delay: p.delay,
            ease: [0.33, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  )
}
