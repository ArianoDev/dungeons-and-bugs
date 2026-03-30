export type GameMode = 'event'

export type ResultType = 'perfect_win' | 'hard_fought_win' | 'heroic_defeat'

export type AnswerType = 'correct' | 'seducing_wrong' | 'incomplete'

export type ClassId =
  | 'frontend-bardo'
  | 'backend-druido'
  | 'devops-paladino'
  | 'ai-stregone'

export interface Hint {
  id: string
  label: string
  description: string
}

export interface AnswerOption {
  id: string
  label: string
  type: AnswerType
}

export interface Dungeon {
  id: string
  order: number
  type: 'standard' | 'boss'
  title: string
  problem: string
  scenario: string
  prompt: string
  options: AnswerOption[]
  correctOptionId: string
  recommendedHintId: string
  hintText: string
  successTitle: string
  successBody: string
  wrongTitle: string
  wrongBody: string
  incompleteBody: string
  reportTags: string[]
}

export interface GameClass {
  id: ClassId
  label: string
  stackLabel: string
  fantasyTitle: string
  pitch: string
  intro: string
  palette: {
    accent: string
    accentSoft: string
    glow: string
  }
  hints: Hint[]
  archetypes: {
    perfect: string
    gritty: string
    defeat: string
  }
  contentRecommendations: string[]
  dungeons: Dungeon[]
}

export interface RunAnswer {
  dungeonId: string
  optionId: string
  optionType: AnswerType
  wasCorrect: boolean
  usedHintId?: string
}

export interface FinalReport {
  classId: ClassId
  classLabel: string
  stackLabel: string
  resultType: ResultType
  archetype: string
  score: number
  remainingHp: number
  hintsUsed: number
  failedDungeons: string[]
  strongAreas: string[]
  weakAreas: string[]
  technicalTags: string[]
  recommendedContent: string[]
  recommendedCta: string
}

export interface LeadFormState {
  email: string
  name: string
  interest: string
  consent: boolean
}

export interface LeadCapturePayload {
  email: string
  name?: string
  interest?: string
  consent: boolean
  mode: GameMode
  classId: ClassId
  classLabel: string
  resultType: ResultType
  score: number
  remainingHp: number
  hintsUsed: number
  strongAreas: string[]
  weakAreas: string[]
  technicalTags: string[]
}

export interface LeadCaptureRecord extends LeadCapturePayload {
  id: string
  createdAt: string
}

export interface LeaderboardRecord {
  id: string
  nickname: string
  classId: ClassId
  classLabel: string
  score: number
  completionMs: number
  remainingHp: number
  hintsUsed: number
  bossCleared: boolean
}
