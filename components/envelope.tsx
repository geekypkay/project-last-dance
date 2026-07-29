'use client'

import { motion } from 'framer-motion'
import { ENVELOPE, REVEAL, SPRING, STAGES, type Stage } from '@/lib/letter-config'
import { WaxSeal } from './wax-seal'
import { SealParticles } from './seal-particles'

interface EnvelopeProps {
  stage: Stage
}

/**
 * Vertical translate of the inner letter sheet for each stage (px, negative = up).
 * The sheet's resting position (transform 0) is tucked behind the pocket lip.
 */
function letterOffset(stage: Stage): number {
  if (stage >= STAGES.PEEKING) return -REVEAL.slide
  if (stage >= STAGES.FLAP_OPEN) return -REVEAL.peek
  return 0 // resting: fully hidden behind the pocket
}

export function Envelope({ stage }: EnvelopeProps) {
  const { width, height, radius } = ENVELOPE
  const flapHeight = height * ENVELOPE.flapHeightRatio
  const flapOpen = stage >= STAGES.FLAP_OPEN
  const sealBroken = stage >= STAGES.BREAKING
  const faded = stage >= STAGES.EXPANDED

  // Geometry shared between the pocket clip-path and the SVG crease overlay so
  // the folded seams land exactly on the paper edges.
  const lipTopY = height * 0.26 // center lip apex
  const shoulderY = height * 0.4 // where the top seams meet the side edges
  const bottomApexY = height * 0.6 // where the bottom triangular flap points
  // Pull the seam endpoints in from the pocket's rounded top corners so the
  // crease lines tuck under the rounding instead of poking out past it.
  const seamInset = radius * 0.75
  const shoulderStartY = shoulderY + seamInset * 0.6

  return (
    <motion.div
      className="relative"
      style={{ width, height }}
      animate={{ opacity: faded ? 0 : 1, scale: faded ? 0.92 : 1 }}
      transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="relative h-full w-full">
        {/* Back panel */}
        <div
          className="paper-noise absolute inset-0"
          style={{
            borderRadius: radius,
            background:
              'linear-gradient(160deg, #e6d6c1 0%, #ddccb6 55%, #d4c3ad 100%)',
            boxShadow:
              'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -18px 34px -22px rgba(58,49,43,0.4), 0 30px 60px -30px rgba(58,49,43,0.5)',
          }}
        />

        {/* Inner letter sheet (the physical letter that rises) */}
        <motion.div
          className="paper-noise absolute overflow-hidden"
          style={{
            left: '7%',
            width: '86%',
            top: 106,
            height: 140,
            zIndex: 5,
            borderRadius: 8,
            background: 'linear-gradient(180deg, #fffdfb 0%, #f7f1e8 100%)',
            boxShadow: '0 10px 24px -14px rgba(58,49,43,0.5)',
          }}
          initial={false}
          animate={{ y: letterOffset(stage) }}
          transition={SPRING.soft}
        >
          <div className="flex flex-col items-center gap-2 px-6 pt-6">
            <span className="font-serif text-[11px] uppercase tracking-[0.4em] text-ink/40">
              for you
            </span>
            <div
              className="mt-1 h-px w-10"
              style={{ background: 'var(--gold)' }}
            />
            {/* faint suggestion of handwritten lines */}
            <div className="mt-3 flex w-full flex-col gap-2 opacity-40">
              {[92, 80, 88, 72].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{ width: `${w}%`, background: '#d8cbb8' }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Front pocket with upward center lip */}
        <div
          className="paper-noise absolute inset-0"
          style={{
            zIndex: 20,
            borderRadius: radius,
            clipPath: 'polygon(0 40%, 50% 26%, 100% 40%, 100% 100%, 0 100%)',
            background:
              'linear-gradient(155deg, #ecdec9 0%, #e2d1bc 60%, #d8c6b0 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)',
          }}
        />

        {/* Folded-paper seams + shading that follow the real pocket geometry.
            Each crease is a soft shadow with a 1px highlight offset to read as
            a raised paper ridge. */}
        <svg
          className="absolute inset-0"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            zIndex: 21,
            borderRadius: radius,
            clipPath: 'polygon(0 40%, 50% 26%, 100% 40%, 100% 100%, 0 100%)',
          }}
          aria-hidden="true"
        >
          <defs>
            {/* Soft interior shading of the bottom flap triangle */}
            <linearGradient id="flapShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(58,49,43,0.16)" />
              <stop offset="55%" stopColor="rgba(58,49,43,0.04)" />
              <stop offset="100%" stopColor="rgba(58,49,43,0)" />
            </linearGradient>
            {/* Faint tint of the two upper side flaps tucked behind the lip */}
            <linearGradient id="sideShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="100%" stopColor="rgba(58,49,43,0.06)" />
            </linearGradient>
          </defs>

          {/* Large bottom triangular flap face (subtle shading) */}
          <polygon
            points={`0,${shoulderY} ${width},${shoulderY} ${width},${height} 0,${height}`}
            fill="url(#flapShade)"
            opacity={0.5}
          />
          {/* Upper-left and upper-right side flap faces */}
          <polygon
            points={`0,${shoulderY} ${width / 2},${lipTopY} ${width / 2},${bottomApexY}`}
            fill="url(#sideShade)"
            opacity={0.5}
          />
          <polygon
            points={`${width},${shoulderY} ${width / 2},${lipTopY} ${width / 2},${bottomApexY}`}
            fill="url(#sideShade)"
            opacity={0.5}
          />

          {/* --- Crease shadows (drawn first) --- */}
          <g
            stroke="rgba(58,49,43,0.22)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          >
            {/* Top-left seam (side edge -> center lip) */}
            <line x1={seamInset} y1={shoulderStartY} x2={width / 2} y2={lipTopY} />
            {/* Top-right seam */}
            <line x1={width - seamInset} y1={shoulderStartY} x2={width / 2} y2={lipTopY} />
            {/* Bottom flap seams meeting at the pocket's inner apex */}
            <line x1="0" y1={height} x2={width / 2} y2={bottomApexY} />
            <line x1={width} y1={height} x2={width / 2} y2={bottomApexY} />
            {/* Short converging seams from the shoulders to the apex */}
            <line x1={seamInset} y1={shoulderStartY} x2={width / 2} y2={bottomApexY} />
            <line x1={width - seamInset} y1={shoulderStartY} x2={width / 2} y2={bottomApexY} />
          </g>

          {/* --- Crease highlights (offset 1px up/left for a ridge) --- */}
          <g
            stroke="rgba(255,251,244,0.55)"
            strokeWidth="0.75"
            fill="none"
            strokeLinecap="round"
          >
            <line x1={seamInset} y1={shoulderStartY - 1} x2={width / 2} y2={lipTopY - 1} />
            <line x1={width - seamInset} y1={shoulderStartY - 1} x2={width / 2} y2={lipTopY - 1} />
            <line x1="0" y1={height - 1} x2={width / 2} y2={bottomApexY - 1} />
            <line x1={width} y1={height - 1} x2={width / 2} y2={bottomApexY - 1} />
          </g>
        </svg>

        {/* Corner wear + edge darkening on the pocket */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 22,
            borderRadius: radius,
            clipPath: 'polygon(0 40%, 50% 26%, 100% 40%, 100% 100%, 0 100%)',
            mixBlendMode: 'multiply',
            background:
              'radial-gradient(38% 44% at 0% 100%, rgba(90,66,40,0.16), transparent 60%),' +
              'radial-gradient(38% 44% at 100% 100%, rgba(90,66,40,0.16), transparent 60%),' +
              'radial-gradient(70% 50% at 50% 100%, transparent 62%, rgba(90,66,40,0.1) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Top flap (hinged at the top edge) */}
        <motion.div
          className="absolute left-0 top-0"
          style={{
            width: '100%',
            height: flapHeight,
            transformOrigin: '50% 0%',
            transformPerspective: 1600,
            zIndex: flapOpen ? 2 : 30,
          }}
          initial={false}
          animate={{ rotateX: flapOpen ? -172 : 0 }}
          transition={SPRING.gentle}
        >
          {/* Flap outer face */}
          <div
            className="paper-noise absolute inset-0"
            style={{
              borderRadius: `${radius}px ${radius}px 0 0`,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: flapOpen
                ? 'linear-gradient(180deg, #dccbb4 0%, #cdbca6 100%)'
                : 'linear-gradient(180deg, #efe1cf 0%, #e2d2bd 60%, #d8c7b1 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.45)',
            }}
          />
          {/* Flap liner — a slightly inset, cooler paper visible along the edge */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(3% 4%, 97% 4%, 50% 94%)',
              background:
                'linear-gradient(180deg, #f3ecdd 0%, #e8dccb 100%)',
              opacity: 0.55,
            }}
            aria-hidden="true"
          />
          {/* Flap edge shading + center crease */}
          <svg
            className="absolute inset-0"
            width={width}
            height={flapHeight}
            viewBox={`0 0 ${width} ${flapHeight}`}
            aria-hidden="true"
          >
            {/* Start the fold lines a bit down the diagonal so they tuck
                under the flap's rounded top corners instead of poking out. */}
            {(() => {
              const inX = radius * 0.7
              const inY = (flapHeight / (width / 2)) * inX
              return (
                <>
                  {/* diagonal edge shadows */}
                  <g stroke="rgba(58,49,43,0.18)" strokeWidth="1" fill="none">
                    <line x1={inX} y1={inY} x2={width / 2} y2={flapHeight} />
                    <line x1={width - inX} y1={inY} x2={width / 2} y2={flapHeight} />
                  </g>
                  {/* diagonal edge highlights */}
                  <g stroke="rgba(255,251,244,0.5)" strokeWidth="0.75" fill="none">
                    <line x1={inX + 1} y1={inY} x2={width / 2 + 1} y2={flapHeight} />
                    <line x1={width - inX - 1} y1={inY} x2={width / 2 - 1} y2={flapHeight} />
                  </g>
                </>
              )
            })()}
          </svg>
        </motion.div>

        {/* Wax seal sits over the flap tip (own layer so the flap's
            triangular clip-path never crops it) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: flapHeight - 39, zIndex: 40 }}
        >
          <div className="relative">
            <WaxSeal broken={sealBroken} />
            <SealParticles active={sealBroken} delay={3.2} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
