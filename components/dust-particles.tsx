'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DustParticlesProps {
  /** How many motes to render. */
  count?: number
}

interface Mote {
  id: number
  left: number
  top: number
  size: number
  driftX: number
  driftY: number
  duration: number
  delay: number
  maxOpacity: number
  gold: boolean
}

/** A small seeded-ish random helper so the field feels organic but stable. */
function buildMotes(count: number): Mote[] {
  const motes: Mote[] = []
  for (let i = 0; i < count; i++) {
    motes.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 3.5,
      // gentle, random wandering offsets (px)
      driftX: (Math.random() - 0.5) * 120,
      driftY: -40 - Math.random() * 120,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * -30,
      maxOpacity: 0.15 + Math.random() * 0.4,
      // a few motes catch a warm golden glow
      gold: Math.random() < 0.35,
    })
  }
  return motes
}

/**
 * Ambient floating dust motes drifting on random paths, evoking sunlit
 * particles in still air for a soft, romantic atmosphere. Purely decorative.
 */
export function DustParticles({ count = 40 }: DustParticlesProps) {
  // Generate motes only on the client to avoid a server/client hydration
  // mismatch (the positions rely on Math.random()).
  const [motes, setMotes] = useState<Mote[]>([])

  useEffect(() => {
    setMotes(buildMotes(count))
  }, [count])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: m.gold ? 'var(--gold)' : 'var(--ink)',
            boxShadow: m.gold
              ? '0 0 6px 1px rgba(215,184,106,0.5)'
              : undefined,
            filter: 'blur(0.4px)',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, m.driftX * 0.5, m.driftX],
            y: [0, m.driftY * 0.55, m.driftY],
            opacity: [0, m.maxOpacity, m.maxOpacity, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.75, 1],
          }}
        />
      ))}
    </div>
  )
}
