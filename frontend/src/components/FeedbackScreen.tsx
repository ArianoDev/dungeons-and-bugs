import type { GameClass, RunAnswer } from '../types'
import { IntroStat } from './IntroScreen'

interface FeedbackScreenProps {
  gameClass: GameClass
  outcome: {
    title: string
    body: string
    wasCorrect: boolean
    optionType: RunAnswer['optionType']
  }
  hp: number
  currentDungeonIndex: number
  totalDungeons: number
  onContinue: () => void
}

export function FeedbackScreen({ gameClass, outcome, hp, currentDungeonIndex, totalDungeons, onContinue }: FeedbackScreenProps) {
  const isGameOver = hp <= 0
  const finished = currentDungeonIndex + 1 >= totalDungeons

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center">
      <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-7 text-center shadow-2xl shadow-[var(--accent-glow,#1b2448)] backdrop-blur">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${outcome.wasCorrect ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
          {outcome.wasCorrect ? 'Scelta solida' : outcome.optionType === 'incomplete' ? 'Quasi giusto' : 'Scorciatoia seducente'}
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white">{outcome.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-200">{outcome.body}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <IntroStat label="Classe" value={gameClass.label} />
          <IntroStat label="Vite rimaste" value={`${Math.max(hp, 0)}/3`} />
          <IntroStat label="Progresso" value={isGameOver ? `${currentDungeonIndex + 1}/6` : `${Math.min(currentDungeonIndex + 2, 6)}/6`} />
        </div>
        <button className="primary-button mt-7" onClick={onContinue}>
          {isGameOver ? 'Vedi l esito' : finished ? 'Vai al risultato' : 'Continua il raid'}
        </button>
      </div>
    </section>
  )
}
