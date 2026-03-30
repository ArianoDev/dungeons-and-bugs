import type { GameClass, LeadCapturePayload, LeaderboardRecord } from '../types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

interface BootstrapPayload {
  classes: GameClass[]
  leaderboard: LeaderboardRecord[]
}

export const fetchBootstrap = async (): Promise<BootstrapPayload> => {
  const response = await fetch(`${apiBaseUrl}/bootstrap`)
  if (!response.ok) {
    throw new Error('Impossibile caricare il bootstrap di gioco.')
  }

  return response.json() as Promise<BootstrapPayload>
}

export const submitLeaderboardEntry = async (payload: Omit<LeaderboardRecord, 'id'>) => {
  const response = await fetch(`${apiBaseUrl}/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Impossibile salvare il punteggio in classifica.')
  }

  return response.json() as Promise<{ id: string }>
}

export const submitLeadCapture = async (payload: LeadCapturePayload) => {
  const response = await fetch(`${apiBaseUrl}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Impossibile salvare il lead finale.')
  }

  return response.json() as Promise<{ id: string }>
}
