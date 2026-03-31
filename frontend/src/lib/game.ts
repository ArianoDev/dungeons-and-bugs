import type { Dungeon, FinalReport, GameClass, LeaderboardRecord, ResultType, RunAnswer } from '../types'

export type Screen = 'landing' | 'class-select' | 'intro' | 'dungeon' | 'feedback' | 'end'

export interface RunState {
  mode: 'event'
  screen: Screen
  selectedClassId: GameClass['id'] | null
  currentDungeonIndex: number
  hp: number
  hintsLeft: number
  startedAt: number | null
  answers: RunAnswer[]
  hintHistory: string[]
  pendingHintId: string | null
  lastOutcome: {
    title: string
    body: string
    wasCorrect: boolean
    optionType: RunAnswer['optionType']
  } | null
}

export const initialRunState = (): RunState => ({
  mode: 'event',
  screen: 'landing',
  selectedClassId: null,
  currentDungeonIndex: 0,
  hp: 3,
  hintsLeft: 2,
  startedAt: null,
  answers: [],
  hintHistory: [],
  pendingHintId: null,
  lastOutcome: null,
})

export const classOrder: Record<GameClass['id'], number> = {
  'frontend-bardo': 0,
  'backend-druido': 1,
  'devops-paladino': 2,
  'ai-stregone': 3,
}

export const unique = (values: string[]) => [...new Set(values)]

export const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const computeScore = (
  answers: RunAnswer[],
  hp: number,
  hintsLeft: number,
  durationMs: number,
  finishedBoss: boolean,
) => {
  const base = answers.reduce((sum, answer) => sum + (answer.wasCorrect ? 100 : 0), 0)
  const bossBonus = finishedBoss ? 200 : 0
  const hpBonus = hp * 50
  const hintBonus = hintsLeft * 40
  const speedBonus = Math.max(0, 150 - Math.floor(durationMs / 1500))
  return base + bossBonus + hpBonus + hintBonus + speedBonus
}

export const getResultType = (hp: number, answers: RunAnswer[]): ResultType => {
  const allCleared = answers.length === 6 && hp > 0
  if (!allCleared) return 'heroic_defeat'
  if (hp === 3) return 'perfect_win'
  return 'hard_fought_win'
}

export const buildFinalReport = (
  selectedClass: GameClass,
  runState: Pick<RunState, 'answers' | 'hintsLeft' | 'hp'>,
  totalDuration: number,
): FinalReport => {
  const failedAnswers = runState.answers.filter((answer) => !answer.wasCorrect)
  const tags = unique(
    runState.answers.flatMap((answer) => {
      const dungeon = selectedClass.dungeons.find((item) => item.id === answer.dungeonId)
      return dungeon ? dungeon.reportTags : []
    }),
  )

  const resultType = getResultType(runState.hp, runState.answers)
  const archetype =
    resultType === 'perfect_win'
      ? selectedClass.archetypes.perfect
      : resultType === 'hard_fought_win'
        ? selectedClass.archetypes.gritty
        : selectedClass.archetypes.defeat

  return {
    classId: selectedClass.id,
    classLabel: selectedClass.label,
    stackLabel: selectedClass.stackLabel,
    resultType,
    archetype,
    score: computeScore(
      runState.answers,
      runState.hp,
      runState.hintsLeft,
      totalDuration,
      runState.answers.length === 6 && runState.hp > 0,
    ),
    remainingHp: runState.hp,
    hintsUsed: 2 - runState.hintsLeft,
    failedDungeons: failedAnswers.map((answer) => answer.dungeonId),
    strongAreas: tags.slice(0, 3),
    weakAreas: unique(
      failedAnswers.flatMap((answer) => {
        const dungeon = selectedClass.dungeons.find((item) => item.id === answer.dungeonId)
        return dungeon ? dungeon.reportTags.slice(0, 2) : []
      }),
    ).slice(0, 3),
    technicalTags: tags,
    recommendedContent: selectedClass.contentRecommendations,
    recommendedCta:
      resultType === 'heroic_defeat'
        ? 'Equipaggiati meglio e rientra nel dungeon'
        : `Ricevi il kit ${selectedClass.label}`,
  }
}

export const humanizeTag = (value: string) =>
  value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase())

const hashSeed = (value: string) =>
  value.split('').reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 7)

const seededRandom = (seed: number) => {
  let current = seed || 1

  return () => {
    current = (current * 1664525 + 1013904223) >>> 0
    return current / 4294967296
  }
}

export const shuffleDungeonOptions = (dungeon: Dungeon, runSeed: number) => {
  const random = seededRandom(hashSeed(`${dungeon.id}:${runSeed}`))
  const options = [...dungeon.options]

  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[options[index], options[swapIndex]] = [options[swapIndex], options[index]]
  }

  return {
    ...dungeon,
    options,
  }
}

export const sortLeaderboard = (records: LeaderboardRecord[]) =>
  [...records].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score
    if (left.completionMs !== right.completionMs) return left.completionMs - right.completionMs
    if (right.remainingHp !== left.remainingHp) return right.remainingHp - left.remainingHp
    return left.hintsUsed - right.hintsUsed
  })
