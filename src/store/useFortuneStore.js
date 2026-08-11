import { create } from 'zustand'
import { TIMINGS } from '../constants/experience'
import { makeSessionSeed, pickFortune } from '../utils/fortune'

function createSessionState() {
  return {
    stage: 'welcome',
    name: '',
    dateOfBirth: '',
    seed: makeSessionSeed(),
    palmImage: null,
    scanScore: 0,
    selectedCardId: null,
    tarotPhase: 'idle',
    fortune: null,
    resultDeadline: null,
  }
}

export const useFortuneStore = create((set, get) => ({
  ...createSessionState(),
  resetRevision: 0,
  acceptFate: () => {
    if (get().stage !== 'welcome') return
    set({ stage: 'identity' })
  },
  submitIdentity: ({ name, dateOfBirth }) => {
    if (get().stage !== 'identity') return
    set({ name: name.trim(), dateOfBirth, stage: 'palm' })
  },
  savePalm: (palmImage = null) => {
    if (get().stage !== 'palm') return
    set({ palmImage, stage: 'scanning' })
  },
  completeScan: (scanScore) => {
    if (get().stage !== 'scanning') return
    set({ scanScore, tarotPhase: 'shuffle', stage: 'tarot' })
  },
  setTarotPhase: (tarotPhase) => {
    const state = get()
    const transitions = {
      shuffle: 'cut', cut: 'deal', deal: 'spread', spread: 'selecting', locked: 'revealing',
    }
    if (state.stage !== 'tarot' || transitions[state.tarotPhase] !== tarotPhase) return
    set({ tarotPhase })
  },
  lockTarotCard: (cardId) => {
    const state = get()
    if (state.stage !== 'tarot' || state.tarotPhase !== 'selecting' || state.selectedCardId) return
    set({ selectedCardId: cardId, tarotPhase: 'locked' })
  },
  revealFortune: () => {
    const state = get()
    if (state.stage !== 'tarot' || state.tarotPhase !== 'revealing' || !state.selectedCardId) return
    const fortune = pickFortune(state.name, state.dateOfBirth, state.selectedCardId, state.seed)
    set({
      fortune,
      tarotPhase: 'complete',
      resultDeadline: Date.now() + TIMINGS.resultDuration,
      stage: 'result',
    })
  },
  resetSession: () => set((state) => ({
    ...createSessionState(),
    resetRevision: state.resetRevision + 1,
  })),
}))
