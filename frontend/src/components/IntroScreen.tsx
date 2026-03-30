import type { GameClass } from '../types'

interface IntroScreenProps {
  gameClass: GameClass
  onStart: () => void
  onBack: () => void
}

export function IntroScreen({ gameClass, onStart, onBack }: IntroScreenProps) {
  return (
    <section className="grid flex-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
        <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${gameClass.palette.accent}22`, color: gameClass.palette.accent }}>
          {gameClass.stackLabel}
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white">{gameClass.label}</h2>
        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/50">{gameClass.fantasyTitle}</p>
        <p className="mt-5 text-slate-300">{gameClass.intro}</p>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-white/50">Il raid ha inizio</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Ti aspettano 6 Dungeons da risolvere.</h3>
        <p className="mt-4 max-w-2xl text-slate-300">
          Le fiamme hanno raggiunto i sistemi di Stackoria. Ogni errore ti costa 1 HP. Il sesto dungeon è il boss finale. Lo score premia velocità, precisione e sangue freddo.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <IntroStat label="Vite" value="3" />
          <IntroStat label="Hint" value="2" />
          <IntroStat label="Durata media" value="3 min" />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button className="primary-button" onClick={onStart}>
            Vai al cronometro
          </button>
          <button className="secondary-button" onClick={onBack}>
            Cambia classe
          </button>
        </div>
      </div>
    </section>
  )
}

export function IntroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}
