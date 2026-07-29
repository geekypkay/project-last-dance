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
  greeting: 'Hi, Aapti',
  title: 'The Last Dance',
  paragraphs: [
    `I don't really know how to begin this.
  
  I've been staring at this blank page for a while because every time I tried to write something, it sounded like I was trying too hard.
  
  I don't know if this is going to be the best thing I've ever written.
  
  It probably won't be.
  
  I just hope it's the most honest.`,
  
    `I've been trying to write this for days.
  
  I don't think you know how many versions of this letter have existed.
  
  Some were angry.
  
  Some were hopeful.
  
  Some tried so hard to sound mature that they forgot to sound honest.
  
  None of them felt like me.
  
  This one finally does.`,
  
    `There was a time when I thought if I could just find the perfect words, maybe everything would make sense.
  
  Turns out...
  
  there aren't any.
  
  No sentence is going to magically make someone feel something they don't.
  
  I know that now.
  
  So this isn't me trying to change your mind.
  
  It's just me finally putting down the words I've carried around for longer than I should have.`,
  
    `I used to think this was something I had to get over as quickly as possible.
  
  Then I spent a long time being annoyed at myself because I couldn't.
  
  Then eventually...
  
  I just accepted it.
  
  Not in a sad way.
  
  Just...
  
  this is how I feel.
  
  And pretending otherwise started feeling more exhausting than being honest.`,
  
    `I've spent a long time wondering if these feelings would eventually become a memory.
  
  I thought that's how it worked.
  
  You wait long enough, stay busy enough, tell yourself enough times that it's over...
  
  and eventually your heart gets the message.
  
  Mine never really did.
  
  It just became quieter.
  
  Not weaker.
  
  Just...
  
  less desperate to be noticed.`,
  
    `Somewhere along the way, I stopped asking,
  
  "Will she ever like me?"
  
  and started asking,
  
  "Will I ever stop liking her?"
  
  That question scared me much more.`,
  
    `I don't think about you every minute.
  
  Life doesn't stop like that.
  
  I have my own days.
  
  My own problems.
  
  My own plans.
  
  I laugh.
  
  I get stressed.
  
  I get distracted.
  
  And then, out of nowhere...
  
  something reminds me of you.`,
  
    `Not in some dramatic movie kind of way.
  
  Just...
  
  "Oh, she'd probably laugh at this."
  
  Or,
  
  "I wonder how she's doing."
  
  Little thoughts.
  
  The kind that quietly become part of someone's life without asking permission.`,
  
    `I've asked myself a lot of uncomfortable questions.
  
  "Am I just attached to an idea?"
  
  "Am I holding onto the past?"
  
  "Do I only feel this way because I never got an ending?"
  
  I genuinely tried to answer them honestly.
  
  Maybe that's why it took me so long to write this.
  
  Because I wanted to make sure I wasn't confusing hope with truth.
  
  The strange thing is...
  
  after all that questioning...
  
  the answer never changed.`,
  
    `I don't know how you feel.
  
  Maybe you've never looked at me that way.
  
  Maybe you never will.
  
  I honestly don't know.
  
  And I think I've finally made peace with not knowing.
  
  That's why I'm writing this.
  
  Not because I'm expecting this letter to change your mind.
  
  Not because I think four years should mean something to you just because they meant something to me.
  
  I just didn't want the last thing you ever knew about this to be something I never actually said properly.`,
  
    `There were so many moments when I wanted to tell you all of this.
  
  Not because I thought it would change anything.
  
  Just because I was tired of being the only person who knew.`,
  
    `I don't think you ever asked me to carry these feelings.
  
  That's what makes this so strange.
  
  They were never your responsibility.
  
  They just...
  
  became my reality.
  
  The embarrassing part isn't that I still like you.
  
  The embarrassing part is how many times I celebrated finally moving on...
  
  only to realize I was celebrating too early.
  
  I don't think my feelings survived because I held onto them.
  
  I think they survived because, every time I tried to let them go,
  
  they quietly found their way back.`,
  
    `I used to think that if this story didn't end the way I wanted...
  
  then maybe it wasn't worth telling.
  
  I don't believe that anymore.
  
  Some stories are worth telling simply because they're true.
  
  Even if they don't end the way we hoped.
  
  I think that's the real reason this letter exists.
  
  Not to convince you.
  
  Not to impress you.
  
  Not because I think I've earned a yes by waiting.
  
  I haven't.
  
  It exists because I got tired of carrying around words that only one person had ever heard.
  
  Me.`,
  
    `So if you're reading this...
  
  I'm not asking you to carry the weight of four years.
  
  Please don't.
  
  Those years belong to me.
  
  They shaped me.
  
  They taught me patience.
  
  They taught me disappointment.
  
  They taught me hope.
  
  And eventually...
  
  they taught me that loving someone also means respecting the possibility that they might not choose you.
  
  I think that's the hardest lesson I've ever learned.`,
  
    `I hope this letter doesn't feel unfair.
  
  That thought crossed my mind a lot while writing it.
  
  Because the last thing I want is for you to feel responsible for emotions that were never yours to manage.
  
  I'm writing this because these feelings belong to me.
  
  Your answer belongs to you.`,
  
    `I don't know what you're about to say.
  
  Maybe by the time you reach the next line, you've already decided.
  
  Maybe you decided years ago.
  
  Maybe you're still thinking.
  
  Whatever it is...
  
  I want your answer to be the one that's true.
  
  Not the one that protects me.
  
  Not the one you think I want to hear.
  
  Just...
  
  the truth.`,
  ],
  /** Paragraphs shown after the proposal question. */
  paragraphsAfter: [
    `If you don't feel the same...
  
  please don't feel guilty.
  
  Really.
  
  I don't want this letter to become something heavy that you feel responsible for carrying.
  
  My feelings are mine.
  
  Your answer is yours.
  
  Both deserve to be honest.`,
  
    `I think that's actually why I'm here.
  
  Not because I need a yes.
  
  Because I don't want to spend years wondering what would've happened if I'd never asked properly.
  
  I don't want "what if" to be the last chapter.`,
  
    `Maybe this changes nothing.
  
  Maybe after today everything stays exactly the same.
  
  Maybe this becomes the last page of a story I've been reading alone for years.
  
  If it does...
  
  that's okay.
  
  At least it'll finally have an ending.
  
  And endings, even painful ones,
  
  let people stop wondering.`,
  
    `Whatever your answer is,
  
  thank you.
  
  Not just for reading this.
  
  For every random conversation.
  
  Every joke.
  
  Every memory,
  
  no matter how small it probably seemed to you.
  
  They mattered to me.`,
  ],
  closing: '',
  question: 'Would you like to be my girlfriend?',
  signature: '',
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
