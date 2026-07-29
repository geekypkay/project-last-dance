/**
 * Central configuration for the confession experience.
 * Keeping the sequence, dimensions, and copy here avoids scattering
 * magic numbers across the animation components.
 */

export const STAGES = {
  SEALED: 0,
  BREAKING: 1,
  FLAP_OPEN: 2,
  PEEKING: 3,
  EXPANDED: 4,
  READING: 5,
} as const

export type Stage = (typeof STAGES)[keyof typeof STAGES]

/** The last interactive stage the user can advance to by clicking. */
export const FINAL_STAGE: Stage = STAGES.READING

/** Envelope pixel geometry — everything else is derived from these. */
export const ENVELOPE = {
  width: 380,
  height: 250,
  flapHeightRatio: 0.62,
  radius: 18,
} as const

/** How far (px) the letter peeks above the envelope at each reveal step. */
export const REVEAL = {
  peek: 44,
  slide: 150,
} as const

/** Spring presets tuned for a slow, cinematic feel. */
export const SPRING = {
  gentle: { type: 'spring', stiffness: 60, damping: 18, mass: 1.1 },
  soft: { type: 'spring', stiffness: 45, damping: 16, mass: 1.2 },
  seal: { type: 'spring', stiffness: 120, damping: 14 },
} as const

export const LETTER = {
  greeting: 'Hey Aapti,',
  title: 'The Last Dance',
  paragraphs: [
    'baad',
    'mein',
    'daalenge',
  ],
  closing: 'wuhooooooooooo',
  question: 'Will you be my girlfriend?',
  signature: 'Always yours,',
  signatureName: 'Priyansh',
  /** The affirmative answer button. */
  yes: 'Yes',
  /** The playful, evasive answer button. */
  no: 'No',
} as const

/** Copy for the closing keepsake shown once she says yes. */
export const KEEPSAKE = {
  eyebrow: 'And just like that,',
  headline: 'Forever starts now.',
  line: 'Thank you for saying yes. This is the beginning of my favourite story.',
  footer: 'With all my heart,',
  footerName: 'Priyansh',
} as const

export const PROMPTS: Record<Stage, string> = {
  [STAGES.SEALED]: 'Tap the seal to open',
  [STAGES.BREAKING]: '',
  [STAGES.FLAP_OPEN]: 'Tap to lift the letter',
  [STAGES.PEEKING]: 'Tap to read',
  [STAGES.EXPANDED]: '',
  [STAGES.READING]: '',
}
