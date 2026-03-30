import type { GameClass } from '../types'

interface DungeonScreenProps {
  gameClass: GameClass
  dungeon: GameClass['dungeons'][number]
  hintsLeft: number
  onUseHint: () => void
  onAnswer: (optionId: string) => void
  isHintOpen: boolean
  onCloseHint: () => void
}

export function DungeonScreen({
  gameClass,
  dungeon,
  hintsLeft,
  onUseHint,
  onAnswer,
  isHintOpen,
  onCloseHint,
}: DungeonScreenProps) {
  const hintLabel = gameClass.hints.find((hint) => hint.id === dungeon.recommendedHintId)?.label ?? 'Hint'

  return (
    <section className="grid flex-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-[var(--accent-glow,#1b2448)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              {dungeon.type === 'boss' ? 'Boss finale - 6 di 6' : `Dungeon ${dungeon.order} di 6`}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white">{dungeon.title}</h2>
          </div>
          {dungeon.type === 'boss' ? <span className="rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">Scontro combinato</span> : null}
        </div>
        <p className="mt-5 text-sm uppercase tracking-[0.18em] text-white/40">{dungeon.problem}</p>
        <p className="mt-4 text-lg leading-8 text-slate-200">{dungeon.scenario}</p>
        <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base text-white">{dungeon.prompt}</p>
        <div className="mt-6 space-y-3">
          {dungeon.options.map((option) => (
            <button key={option.id} className="option-card" onClick={() => onAnswer(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Strumenti arcani</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{hintLabel}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {gameClass.hints.find((hint) => hint.id === dungeon.recommendedHintId)?.description}
          </p>
          <button className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40" onClick={onUseHint} disabled={hintsLeft === 0}>
            {hintsLeft === 0 ? 'Hint esauriti' : `Usa ${hintLabel}`}
          </button>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Tono di partita</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Versione speedrun: leggi in fretta, scegli bene, proteggi lo score.
          </p>
        </div>
      </aside>
      {isHintOpen ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/70 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-[1.8rem] border border-white/10 bg-[#0b1026] p-5 shadow-2xl shadow-black/50">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Hint rivelato</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{hintLabel}</h3>
            <p className="mt-4 text-base leading-7 text-slate-200">{dungeon.hintText}</p>
            <button className="primary-button mt-6 w-full" onClick={onCloseHint}>
              Torna alla scelta
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
