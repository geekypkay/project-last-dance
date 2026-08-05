'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { PROMPTS, STAGES, type Stage } from '@/lib/letter-config'
import { Envelope } from './envelope'
import { ConfessionLetter } from './confession-letter'
import { DustParticles } from './dust-particles'
import { PetalRain } from './petal-rain'

export function EnvelopeExperience() {
  const [stage, setStage] = useState<Stage>(STAGES.SEALED)
  const [ready] = useState(true)
  const reduce = useReducedMotion()
  const busyRef = useRef(false)

  const reading = stage >= STAGES.READING
  const interactive = ready && stage < STAGES.EXPANDED && !busyRef.current

  const advance = useCallback(() => {
    if (busyRef.current) return

    setStage((current) => {
      switch (current) {
        case STAGES.SEALED: {
          // Break the seal, then let the flap open on its own.
          busyRef.current = true
          window.setTimeout(() => {
            busyRef.current = false
            setStage(STAGES.FLAP_OPEN)
          }, 5000)
          return STAGES.BREAKING
        }
        case STAGES.FLAP_OPEN:
          return STAGES.PEEKING
        case STAGES.PEEKING: {
          // Expand, then settle into the reading view.
          busyRef.current = true
          window.setTimeout(() => {
            busyRef.current = false
            setStage(STAGES.READING)
          }, 850)
          return STAGES.EXPANDED
        }
        default:
          return current
      }
    })
  }, [])

  const reset = useCallback(() => {
    busyRef.current = false
    setStage(STAGES.SEALED)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      advance()
    }
  }

  const prompt = PROMPTS[stage]

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Ambient light — a soft warm glow, layered and gentle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, rgba(255,253,251,0.9) 0%, rgba(248,243,234,0.6) 45%, rgba(231,216,197,0.35) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 50% 115%, rgba(215,184,106,0.12), transparent 60%)',
        }}
      />
      {/* Cinematic vignette — darkens the edges to spotlight the envelope */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 42%, transparent 55%, rgba(58,49,43,0.16) 100%)',
        }}
      />

      {/* Ambient floating dust — drifting motes for a romantic atmosphere */}
      <DustParticles count={reduce ? 0 : 48} />

      {/* Slow rose-petal rain while the letter is being read */}
      <PetalRain active={reading && !reduce} count={16} />

      {/* Envelope stage */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-14 px-6 py-16">
        <div className="origin-center scale-[0.78] sm:scale-100">
          <motion.div
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? prompt || 'Open the letter' : undefined}
            onClick={interactive ? advance : undefined}
            onKeyDown={onKeyDown}
            className={interactive ? 'cursor-pointer outline-none' : ''}
            style={{ pointerEvents: stage >= STAGES.EXPANDED ? 'none' : 'auto' }}
            initial={{ opacity: 0, y: 26 }}
            animate={
              !ready
                ? { opacity: 0, y: 26 }
                : stage >= STAGES.EXPANDED
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: reduce ? 0 : [0, -12, 0] }
            }
            transition={
              !ready
                ? { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }
                : stage >= STAGES.EXPANDED
                  ? { duration: 0.6 }
                  : {
                      opacity: { duration: 1.4, ease: [0.22, 0.61, 0.36, 1] },
                      y: reduce
                        ? { duration: 0.4 }
                        : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                    }
            }
          >
            <Envelope stage={stage} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {ready && prompt && !reading ? (
            <motion.p
              key={prompt}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-sans text-xs uppercase tracking-[0.4em] text-ink/45"
            >
              {prompt}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Full letter overlay — becomes the focus once expanded */}
      <div
        className="absolute inset-0 flex items-start justify-center overflow-y-auto px-6 py-16 sm:py-24"
        style={{
          pointerEvents: reading ? 'auto' : 'none',
          // isolate paints in the scroll region and hint smooth scrolling
          contain: 'paint',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <ConfessionLetter revealed={reading} />
      </div>

      {/* Go back — seals the letter and returns to the start */}
      <AnimatePresence>
        {reading ? (
          <motion.button
            key="back"
            type="button"
            onClick={reset}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1], delay: 1.2 }}
            className="fixed left-1/2 top-6 z-10 -translate-x-1/2 rounded-full border border-gold/40 bg-background/95 px-5 py-2 font-sans text-xs uppercase tracking-[0.3em] text-ink/60 outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold"
          >
            Close the letter
          </motion.button>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
