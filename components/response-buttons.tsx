'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { LETTER } from '@/lib/letter-config'

interface ResponseButtonsProps {
  onAccept: () => void
}

/**
 * The moment of truth. A warm, obvious "Yes" and a playful "No" that keeps
 * slipping away from the cursor, so the only real answer is yes. Each dodge
 * nudges the "Yes" a touch bigger for a bit of teasing escalation.
 */
export function ResponseButtons({ onAccept }: ResponseButtonsProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)

  const dodge = useCallback(() => {
    // hop to a new nearby position, kept within a gentle range
    const x = (Math.random() - 0.5) * 220
    const y = (Math.random() - 0.5) * 120
    setOffset({ x, y })
    setDodges((d) => Math.min(d + 1, 6))
  }, [])

  const yesScale = 1 + dodges * 0.06

  return (
    <div className="relative mt-10 flex min-h-24 flex-wrap items-center justify-center gap-5">
      <motion.button
        type="button"
        onClick={onAccept}
        animate={{ scale: yesScale }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        whileHover={{ scale: yesScale * 1.05 }}
        whileTap={{ scale: yesScale * 0.96 }}
        className="rounded-full bg-seal px-10 py-3 font-serif text-lg tracking-wide text-[#fbefe2] shadow-[0_8px_20px_rgba(122,30,42,0.35)] outline-none transition-colors hover:bg-seal/90 focus-visible:ring-2 focus-visible:ring-gold"
      >
        {LETTER.yes}
      </motion.button>

      <motion.button
        type="button"
        // dodge on hover (mouse) and on focus/tap attempts (touch + keyboard)
        onMouseEnter={dodge}
        onFocus={dodge}
        onClick={(e) => {
          e.preventDefault()
          dodge()
        }}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="rounded-full border border-ink/25 bg-background/70 px-8 py-3 font-serif text-lg tracking-wide text-ink/55 outline-none"
      >
        {LETTER.no}
      </motion.button>
    </div>
  )
}
