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

/* Natural hand-deckled handmade-paper silhouette shared by the sheet and the
   thickness layers beneath it. Rather than spiking between very shallow and
   very deep insets (which reads as an artificial sawtooth), the edge drifts
   GENTLY: adjacent points differ by only a few pixels so the outline
   undulates organically, the way a real torn/deckle edge wanders. Inset
   amounts are fixed PIXELS (not percentages) so the amplitude stays constant
   no matter how tall the letter grows — a percentage-based inset would
   balloon as the sheet lengthens and slant the sides. */
const EDGE =
  'polygon(' +
  // top edge — gentle organic drift, mostly 2–9px
  '0% 6px, 6% 4px, 12% 7px, 18% 5px, 24% 3px, 30% 6px, 36% 8px, 42% 6px, 48% 4px, 54% 3px, 60% 6px, 66% 8px, 72% 5px, 78% 3px, 84% 6px, 90% 8px, 95% 5px, 100% 4px,' +
  // right edge
  'calc(100% - 6px) 5%, calc(100% - 4px) 12%, calc(100% - 7px) 19%, calc(100% - 5px) 26%, calc(100% - 3px) 33%, calc(100% - 6px) 40%, calc(100% - 8px) 47%, calc(100% - 6px) 54%, calc(100% - 4px) 61%, calc(100% - 3px) 68%, calc(100% - 6px) 75%, calc(100% - 8px) 82%, calc(100% - 5px) 89%, calc(100% - 4px) 95%, 100% calc(100% - 6px),' +
  // bottom edge
  '95% calc(100% - 4px), 90% calc(100% - 7px), 84% calc(100% - 5px), 78% calc(100% - 3px), 72% calc(100% - 6px), 66% calc(100% - 8px), 60% calc(100% - 6px), 54% calc(100% - 4px), 48% calc(100% - 3px), 42% calc(100% - 6px), 36% calc(100% - 8px), 30% calc(100% - 5px), 24% calc(100% - 3px), 18% calc(100% - 6px), 12% calc(100% - 8px), 6% calc(100% - 5px), 0% calc(100% - 4px),' +
  // left edge
  '6px 95%, 4px 89%, 7px 82%, 5px 75%, 3px 68%, 6px 61%, 8px 54%, 6px 47%, 4px 40%, 3px 33%, 6px 26%, 8px 19%, 5px 12%, 4px 5%' +
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
      className="relative w-full max-w-3xl"
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
        {/* Coffee stains, splashes and blots of RANDOM intensity scattered
            across the whole sheet — some deep and saturated, some barely
            there. Droplet clusters and flecks are flicked around to feel
            accidental. Blended with multiply so they sink into the paper
            grain instead of sitting on top. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: EDGE,
            mixBlendMode: 'multiply',
            background:
              // strong deep blots
              'radial-gradient(ellipse 96px 74px at 12% 84%, rgba(96,56,24,0.34), rgba(96,56,24,0.12) 52%, transparent 76%),' +
              'radial-gradient(ellipse 80px 62px at 82% 14%, rgba(90,52,22,0.3), rgba(90,52,22,0.1) 54%, transparent 76%),' +
              'radial-gradient(ellipse 68px 60px at 90% 72%, rgba(100,58,26,0.28), rgba(100,58,26,0.1) 56%, transparent 78%),' +
              // medium mid-tone blots
              'radial-gradient(ellipse 74px 56px at 74% 46%, rgba(112,68,32,0.2), transparent 72%),' +
              'radial-gradient(ellipse 90px 66px at 8% 40%, rgba(116,72,34,0.18), transparent 74%),' +
              'radial-gradient(ellipse 60px 50px at 40% 62%, rgba(110,66,30,0.16), transparent 74%),' +
              'radial-gradient(ellipse 70px 52px at 58% 26%, rgba(114,70,32,0.14), transparent 74%),' +
              // faint washes
              'radial-gradient(ellipse 110px 80px at 30% 20%, rgba(126,84,44,0.1), transparent 78%),' +
              'radial-gradient(ellipse 100px 74px at 66% 90%, rgba(124,82,42,0.1), transparent 78%),' +
              'radial-gradient(ellipse 88px 64px at 20% 66%, rgba(126,84,44,0.08), transparent 78%),' +
              // droplet cluster, upper-center (strong)
              'radial-gradient(circle at 46% 9%, rgba(84,48,20,0.4), transparent 8px),' +
              'radial-gradient(circle at 50% 13%, rgba(84,48,20,0.3), transparent 4px),' +
              'radial-gradient(circle at 42% 15%, rgba(84,48,20,0.26), transparent 3px),' +
              // droplet cluster, lower-right
              'radial-gradient(circle at 82% 90%, rgba(88,50,22,0.34), transparent 7px),' +
              'radial-gradient(circle at 86% 93%, rgba(88,50,22,0.24), transparent 3px),' +
              'radial-gradient(circle at 78% 94%, rgba(88,50,22,0.2), transparent 4px),' +
              // additional deep + mid blots for denser coverage
              'radial-gradient(ellipse 84px 64px at 34% 8%, rgba(94,54,24,0.3), rgba(94,54,24,0.1) 54%, transparent 76%),' +
              'radial-gradient(ellipse 72px 58px at 6% 62%, rgba(98,56,26,0.26), rgba(98,56,26,0.09) 55%, transparent 77%),' +
              'radial-gradient(ellipse 66px 54px at 60% 52%, rgba(104,60,28,0.22), transparent 74%),' +
              'radial-gradient(ellipse 90px 70px at 48% 94%, rgba(96,56,24,0.24), rgba(96,56,24,0.08) 55%, transparent 78%),' +
              'radial-gradient(ellipse 58px 48px at 94% 34%, rgba(108,64,30,0.2), transparent 74%),' +
              'radial-gradient(ellipse 76px 58px at 26% 46%, rgba(114,70,32,0.16), transparent 75%),' +
              // more faint washes
              'radial-gradient(ellipse 104px 78px at 78% 66%, rgba(126,84,44,0.1), transparent 78%),' +
              'radial-gradient(ellipse 96px 70px at 44% 34%, rgba(124,82,42,0.08), transparent 78%),' +
              'radial-gradient(ellipse 88px 66px at 10% 22%, rgba(126,84,44,0.09), transparent 78%),' +
              // extra droplet cluster, mid-left
              'radial-gradient(circle at 18% 44%, rgba(86,50,22,0.32), transparent 6px),' +
              'radial-gradient(circle at 22% 47%, rgba(86,50,22,0.22), transparent 3px),' +
              'radial-gradient(circle at 14% 48%, rgba(86,50,22,0.18), transparent 3px),' +
              // extra droplet cluster, upper-right
              'radial-gradient(circle at 92% 22%, rgba(88,50,22,0.3), transparent 6px),' +
              'radial-gradient(circle at 95% 25%, rgba(88,50,22,0.2), transparent 3px),' +
              'radial-gradient(circle at 89% 26%, rgba(88,50,22,0.16), transparent 3px),' +
              // scattered flecks of varying strength across the sheet
              'radial-gradient(circle at 30% 55%, rgba(92,54,24,0.3), transparent 4px),' +
              'radial-gradient(circle at 63% 70%, rgba(92,54,24,0.2), transparent 3px),' +
              'radial-gradient(circle at 22% 30%, rgba(92,54,24,0.16), transparent 3px),' +
              'radial-gradient(circle at 70% 58%, rgba(92,54,24,0.22), transparent 3px),' +
              'radial-gradient(circle at 15% 52%, rgba(92,54,24,0.14), transparent 3px),' +
              'radial-gradient(circle at 55% 82%, rgba(92,54,24,0.18), transparent 4px),' +
              'radial-gradient(circle at 38% 38%, rgba(92,54,24,0.12), transparent 2px),' +
              'radial-gradient(circle at 88% 40%, rgba(92,54,24,0.2), transparent 3px),' +
              'radial-gradient(circle at 44% 48%, rgba(92,54,24,0.16), transparent 3px),' +
              'radial-gradient(circle at 68% 18%, rgba(92,54,24,0.18), transparent 3px),' +
              'radial-gradient(circle at 34% 74%, rgba(92,54,24,0.2), transparent 4px),' +
              'radial-gradient(circle at 8% 76%, rgba(92,54,24,0.14), transparent 3px),' +
              'radial-gradient(circle at 76% 82%, rgba(92,54,24,0.16), transparent 3px),' +
              'radial-gradient(circle at 52% 60%, rgba(92,54,24,0.12), transparent 2px),' +
              'radial-gradient(circle at 26% 88%, rgba(92,54,24,0.18), transparent 3px),' +
              'radial-gradient(circle at 84% 54%, rgba(92,54,24,0.14), transparent 3px),' +
              // warm corner pooling / edge wear
              'radial-gradient(ellipse 70px 52px at 4% 4%, rgba(120,80,42,0.18), transparent 76%),' +
              'radial-gradient(ellipse 64px 48px at 97% 97%, rgba(118,78,42,0.18), transparent 76%)',
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

        <motion.h2
          variants={line}
          className="mt-12 text-balance text-center font-script text-5xl leading-tight text-seal sm:text-6xl"
        >
          {LETTER.question}
        </motion.h2>

        <div className="mt-12 flex flex-col gap-7">
          {LETTER.paragraphsAfter.map((p, i) => (
            <motion.p
              key={i}
              variants={line}
              className="text-pretty font-serif text-lg leading-loose text-ink/85 sm:text-xl"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {LETTER.closing ? (
          <motion.p
            variants={line}
            className="mt-10 text-pretty font-serif text-lg italic leading-loose text-ink/80 sm:text-xl"
          >
            {LETTER.closing}
          </motion.p>
        ) : null}

        <div className="mt-14 flex flex-col items-end self-stretch">
          {LETTER.signature ? (
            <motion.p
              variants={line}
              className="font-serif text-lg italic leading-none text-ink/70"
            >
              {LETTER.signature}
            </motion.p>
          ) : null}

          <motion.p
            variants={line}
            className="font-script text-4xl leading-none text-seal sm:text-5xl"
          >
            {LETTER.signatureName}
          </motion.p>
        </div>
      </motion.article>
    </motion.div>
  )
}
