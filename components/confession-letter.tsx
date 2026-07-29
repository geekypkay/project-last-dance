'use client'

import { motion } from 'framer-motion'
import { LETTER } from '@/lib/letter-config'

interface ConfessionLetterProps {
  /** When true, the full typeset letter fades in. */
  revealed: boolean
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.4, delayChildren: 0.5 },
  },
}

const line = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] as const },
  },
}

/* Gently uneven handmade-paper silhouette shared by the sheet and the
   thickness layers beneath it. The edges undulate by only a fraction of a
   percent, so it reads as a soft deckle edge on luxury handmade stock —
   naturally imperfect, never torn. */
const EDGE =
  'polygon(' +
  '0% 0.9%, 10% 0.4%, 20% 0.8%, 30% 0.3%, 40% 0.7%, 50% 0.3%, 60% 0.7%, 70% 0.3%, 80% 0.7%, 90% 0.4%, 100% 0.9%,' +
  '99.5% 12%, 99.8% 25%, 99.4% 38%, 99.8% 50%, 99.4% 62%, 99.8% 75%, 99.5% 88%, 100% 99.1%,' +
  '90% 99.6%, 80% 99.2%, 70% 99.7%, 60% 99.3%, 50% 99.7%, 40% 99.3%, 30% 99.7%, 20% 99.2%, 10% 99.6%, 0% 99.1%,' +
  '0.5% 88%, 0.2% 75%, 0.6% 62%, 0.2% 50%, 0.6% 38%, 0.2% 25%, 0.5% 12%' +
  ')'

export function ConfessionLetter({ revealed }: ConfessionLetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -0.6 }}
      animate={
        revealed
          ? { opacity: 1, y: 0, rotate: -0.6 }
          : { opacity: 0, y: 40, rotate: -0.6 }
      }
      transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative w-full max-w-xl"
      style={{
        filter:
          'drop-shadow(0 34px 42px rgba(58,42,26,0.4)) drop-shadow(0 10px 18px rgba(58,42,26,0.26))',
        // Promote to its own compositor layer so the expensive filter +
        // clip-path layers are rasterized once and simply moved on scroll,
        // instead of being re-painted every frame. framer-motion keeps an
        // active transform on this element, so it stays GPU-composited.
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Paper thickness — faint sheets peeking beneath the top sheet. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-[3px] translate-y-[4px]"
        style={{ background: '#e6d6ba', clipPath: EDGE }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 translate-x-[6px] translate-y-[8px]"
        style={{ background: '#ddcaa9', clipPath: EDGE }}
      />

      {/* The physical, aged letter sheet */}
      <motion.article
        variants={container}
        initial="hidden"
        animate={revealed ? 'show' : 'hidden'}
        className="paper-noise aged-paper relative mx-auto flex flex-col px-9 py-16 text-ink sm:px-16 sm:py-20"
        style={{
          clipPath: EDGE,
          background:
            // soft, uneven discoloration across the sheet — pooled warmth in
            // the corners rather than distinct blots
            'radial-gradient(60% 45% at 14% 12%, rgba(150,108,58,0.1), transparent 66%),' +
            'radial-gradient(52% 42% at 88% 88%, rgba(140,100,54,0.1), transparent 68%),' +
            'radial-gradient(40% 30% at 82% 20%, rgba(122,84,46,0.07), transparent 66%),' +
            'radial-gradient(38% 28% at 14% 82%, rgba(122,84,46,0.07), transparent 68%),' +
            // aged parchment body: ivory -> cream -> light tan
            'linear-gradient(172deg, #f8f0dd 0%, #f2e6cf 46%, #ecdfc4 78%, #e7d8bc 100%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset',
        }}
      >
        {/* Gentle edge wear — soft feathered smudges and a couple of barely
            visible spots near the corners. Kept faint so the letter reads as
            lovingly preserved, not dirty. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: EDGE,
            background:
              'radial-gradient(ellipse 60px 46px at 10% 9%, rgba(126,86,44,0.09), transparent 74%),' +
              'radial-gradient(ellipse 54px 40px at 92% 8%, rgba(120,80,42,0.08), transparent 76%),' +
              'radial-gradient(circle at 88% 13%, rgba(118,78,40,0.07), transparent 8px),' +
              'radial-gradient(ellipse 76px 54px at 8% 91%, rgba(128,86,44,0.09), transparent 76%),' +
              'radial-gradient(ellipse 66px 48px at 90% 92%, rgba(124,82,44,0.08), transparent 76%),' +
              'radial-gradient(circle at 40% 96%, rgba(118,78,40,0.06), transparent 7px)',
          }}
        />

        {/* Whisper-faint fold marks and paper waviness — a soft highlight
            paired with a shadow so it reads as a gentle crease in the grain,
            barely perceptible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            clipPath: EDGE,
            mixBlendMode: 'multiply',
            background:
              'linear-gradient(180deg, transparent 33.2%, rgba(112,80,44,0.05) 33.5%, transparent 33.8%),' +
              'linear-gradient(180deg, transparent 66.5%, rgba(112,80,44,0.05) 66.8%, transparent 67.1%),' +
              'linear-gradient(90deg, transparent 49.7%, rgba(112,80,44,0.04) 50%, transparent 50.3%)',
          }}
        />

        <motion.p
          variants={line}
          className="font-script text-4xl leading-none text-seal/90 sm:text-5xl"
        >
          {LETTER.greeting}
        </motion.p>

        <div className="mt-9 flex flex-col gap-7">
          {LETTER.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={line}
              className="text-pretty font-serif text-lg leading-loose text-ink/85 sm:text-xl"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.p
          variants={line}
          className="mt-10 text-pretty font-serif text-lg italic leading-loose text-ink/80 sm:text-xl"
        >
          {LETTER.closing}
        </motion.p>

        <motion.h2
          variants={line}
          className="mt-8 text-balance text-center font-script text-5xl leading-tight text-seal sm:text-6xl"
        >
          {LETTER.question}
        </motion.h2>

        <div className="mt-14 flex flex-col items-end self-stretch">
          <motion.p
            variants={line}
            className="font-serif text-lg italic leading-none text-ink/70"
          >
            {LETTER.signature}
          </motion.p>

          <motion.p
            variants={line}
            className="mt-2 font-script text-2xl leading-none text-seal sm:text-3xl"
          >
            {LETTER.signatureName}
          </motion.p>
        </div>
      </motion.article>
    </motion.div>
  )
}
