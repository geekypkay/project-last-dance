'use client'

import { motion } from 'framer-motion'

interface WaxSealProps {
  broken: boolean
  size?: number
}

/**
 * Timing (seconds) for the slow, cinematic break sequence.
 * 1) the embossed heart gently fades, leaving the bare red disc
 * 2) fine cracks spread across the wax like fractures across cement
 * 3) the disc gives way and crumbles into shards that tumble and fall
 */
const T = {
  heartFade: 1.1,
  crackStart: 1.1,
  crackDraw: 1.0,
  crackStagger: 0.12,
  fallStart: 3.2,
  fallDur: 1.5,
} as const

/**
 * Jagged crack paths on a 100x100 canvas, all radiating from the centre so
 * the fracture reads as though the pressure released from a single point.
 */
const CRACKS = [
  'M50 50 L55 40 L51 29 L57 16',
  'M50 50 L44 43 L47 31 L40 18',
  'M50 50 L61 53 L73 49 L87 55',
  'M50 50 L39 57 L27 53 L13 59',
  'M50 50 L53 62 L47 74 L52 88',
  'M50 50 L63 60 L71 73 L82 82',
  'M50 50 L37 61 L29 77 L18 86',
  // short secondary branches for a more brittle, natural fracture
  'M55 40 L64 38',
  'M44 43 L34 40',
  'M53 62 L64 66',
]

/**
 * Pie-wedge shards, one per gap between the main radial cracks. Each carries a
 * scatter vector so it flies outward along the wedge's direction while gravity
 * pulls it down. Boundary points sit on the r=50 circle at the crack angles.
 */
const SHARDS = [
  { d: 'M50 50 L99.5 57 A50 50 0 0 1 85.4 85.4 Z', dx: 0.9, dy: 0.44 },
  { d: 'M50 50 L85.4 85.4 A50 50 0 0 1 52.6 99.9 Z', dx: 0.41, dy: 0.91 },
  { d: 'M50 50 L52.6 99.9 A50 50 0 0 1 16.5 87.2 Z', dx: -0.33, dy: 0.95 },
  { d: 'M50 50 L16.5 87.2 A50 50 0 0 1 1.5 62.1 Z', dx: -0.86, dy: 0.52 },
  { d: 'M50 50 L1.5 62.1 A50 50 0 0 1 35.4 2.2 Z', dx: -0.87, dy: -0.35 },
  { d: 'M50 50 L35.4 2.2 A50 50 0 0 1 60.4 1.1 Z', dx: -0.05, dy: -0.9 },
  { d: 'M50 50 L60.4 1.1 A50 50 0 0 1 99.5 57 Z', dx: 0.82, dy: -0.5 },
] as const

const RADIAL_GRAD = 'wax-shard-grad'

export function WaxSeal({ broken, size = 78 }: WaxSealProps) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-hidden={broken}
    >
      {/* Breathing invitation glow — a quiet "touch me" while still sealed */}
      {!broken && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.28,
            background:
              'radial-gradient(circle, rgba(215,184,106,0.45) 0%, rgba(215,184,106,0.12) 45%, transparent 70%)',
          }}
          initial={{ opacity: 0.35, scale: 0.92 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Circular drop shadow (un-clipped so it stays perfectly round).
          Fades out just as the shards begin to fall. */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 6px 14px rgba(111,33,38,0.35)' }}
        initial={false}
        animate={broken ? { opacity: 0 } : { opacity: 1 }}
        transition={
          broken
            ? { duration: 0.4, delay: T.fallStart, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeOut' }
        }
      />

      {/* Intact disc: solid wax + cracks + heart. Holds together while the
          fractures spread, then blinks out the instant the shards take over. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={broken ? { opacity: 0 } : { opacity: 1 }}
        transition={
          broken
            ? { duration: 0.18, delay: T.fallStart, ease: 'linear' }
            : { duration: 0.4, ease: 'easeOut' }
        }
      >
        {/* Solid red wax disc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 34% 30%, #a5474c 0%, #8b2e33 46%, #6f2126 100%)',
            boxShadow:
              'inset 0 2px 6px rgba(255,255,255,0.28), inset 0 -6px 12px rgba(0,0,0,0.35)',
          }}
        />

        {/* Cracks — dark fractures that slowly draw themselves across the wax */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          {CRACKS.map((d, i) => (
            <g key={i}>
              {/* soft highlight edge so the fracture catches the light */}
              <motion.path
                d={d}
                stroke="rgba(255,225,210,0.55)"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  broken
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  duration: T.crackDraw,
                  delay: broken ? T.crackStart + i * T.crackStagger : 0,
                  ease: [0.33, 0, 0.2, 1],
                }}
              />
              {/* dark fracture line itself */}
              <motion.path
                d={d}
                stroke="rgba(30,6,8,0.92)"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  broken
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  duration: T.crackDraw,
                  delay: broken ? T.crackStart + i * T.crackStagger : 0,
                  ease: [0.33, 0, 0.2, 1],
                }}
              />
            </g>
          ))}
        </svg>

        {/* Embossed heart — fades away first, leaving the bare red disc */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={broken ? { opacity: 0 } : { opacity: 1 }}
          transition={
            broken
              ? { duration: T.heartFade, ease: 'easeInOut' }
              : { duration: 0.4, ease: 'easeOut' }
          }
        >
          <svg
            width={size * 0.5}
            height={size * 0.5}
            viewBox="0 0 24 24"
            fill="rgba(255, 245, 235, 0.85)"
            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }}
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Falling shards: the disc crumbles apart along the fracture lines and
          the wedges tumble outward and down under gravity. */}
      <svg
        className="absolute inset-0 overflow-visible"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={RADIAL_GRAD} cx="0.34" cy="0.3" r="0.75">
            <stop offset="0%" stopColor="#a5474c" />
            <stop offset="46%" stopColor="#8b2e33" />
            <stop offset="100%" stopColor="#6f2126" />
          </radialGradient>
        </defs>
        {SHARDS.map((s, i) => (
          <motion.path
            key={i}
            d={s.d}
            fill={`url(#${RADIAL_GRAD})`}
            stroke="rgba(30,6,8,0.55)"
            strokeWidth={0.6}
            style={{ transformOrigin: '50px 50px' }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={
              broken
                ? {
                    x: s.dx * 46,
                    y: s.dy * 46 + 60,
                    rotate: s.dx * 55,
                    opacity: [0, 1, 1, 0],
                  }
                : { x: 0, y: 0, rotate: 0, opacity: 0 }
            }
            transition={
              broken
                ? {
                    duration: T.fallDur,
                    delay: T.fallStart + i * 0.04,
                    ease: [0.4, 0, 0.9, 1],
                    opacity: {
                      duration: T.fallDur,
                      delay: T.fallStart + i * 0.04,
                      times: [0, 0.12, 0.6, 1],
                    },
                  }
                : { duration: 0.2 }
            }
          />
        ))}
      </svg>
    </div>
  )
}
