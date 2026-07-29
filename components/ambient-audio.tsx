'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface AmbientAudioProps {
  /** When true, the ambient pad swells in (subject to the mute toggle). */
  playing: boolean
}

/**
 * A soft, looping ambient pad synthesised entirely in the browser — a slow,
 * warm chord with gentle movement, no audio file required. It fades in while
 * the letter is being read and can be muted at any time. Autoplay policies are
 * respected: sound only ever starts after a user gesture (the toggle, or the
 * click-driven reveal that precedes `playing`).
 */
export function AmbientAudio({ playing }: AmbientAudioProps) {
  const [muted, setMuted] = useState(false)
  // graph nodes kept across renders
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)

  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctor()

      const master = ctx.createGain()
      master.gain.value = 0.0001
      // gentle warmth: roll off the highs so nothing is harsh
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1100
      filter.Q.value = 0.4
      master.connect(filter).connect(ctx.destination)

      // A soft, open chord voicing (A2, E3, A3, C#4, E4) — warm and hopeful.
      const chord = [110, 164.81, 220, 277.18, 329.63]
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = i % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.value = freq
        // slight detune per voice keeps the pad alive and choral
        osc.detune.value = (i - 2) * 4

        const voice = ctx.createGain()
        voice.gain.value = 0.16 / (i + 1)

        // slow amplitude drift so voices breathe against each other
        const lfo = ctx.createOscillator()
        lfo.type = 'sine'
        lfo.frequency.value = 0.05 + i * 0.017
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = voice.gain.value * 0.5
        lfo.connect(lfoGain).connect(voice.gain)

        osc.connect(voice).connect(master)
        osc.start()
        lfo.start()
      })

      ctxRef.current = ctx
      masterRef.current = master
      startedRef.current = true
      return ctx
    } catch {
      // audio is a graceful enhancement; ignore failures
      return null
    }
  }, [])

  // Swell the master gain toward the target whenever playing/muted changes.
  useEffect(() => {
    const shouldPlay = playing && !muted
    if (!shouldPlay && !startedRef.current) return

    const ctx = ensureGraph()
    const master = masterRef.current
    if (!ctx || !master) return

    void ctx.resume()
    const now = ctx.currentTime
    const target = shouldPlay ? 0.09 : 0.0001
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
    // long, cinematic fade in / out
    master.gain.exponentialRampToValueAtTime(target, now + (shouldPlay ? 4 : 1.4))
  }, [playing, muted, ensureGraph])

  // Tidy up the audio graph on unmount.
  useEffect(() => {
    return () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [])

  // The toggle only appears once the reading experience has begun.
  if (!playing) return null

  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? 'Unmute ambient music' : 'Mute ambient music'}
      onClick={() => setMuted((m) => !m)}
      className="fixed right-5 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-background/95 text-ink/60 outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold"
    >
      {muted ? (
        // muted: speaker with a slash
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5 6 9H3v6h3l5 4V5Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="m17 9 4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        // playing: speaker with sound waves
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 5 6 9H3v6h3l5 4V5Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}
