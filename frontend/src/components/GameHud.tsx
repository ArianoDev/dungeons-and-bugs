import type { GameClass } from '../types'
import { formatTime } from '../lib/game'

interface GameHudProps {
  currentClass: GameClass
  currentDungeonIndex: number
  hp: number
  hintsLeft: number
  elapsedMs: number
}

export function GameHud({ currentClass, currentDungeonIndex, hp, hintsLeft, elapsedMs }: GameHudProps) {
  return (
    <section className="mb-5 grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${currentClass.palette.accent}20`, color: currentClass.palette.accent }}>
          {currentClass.label}
        </span>
        <HudChip label="Dungeon" value={`${Math.min(currentDungeonIndex + 1, 6)}/6`} />
        <HudChip label="Vite" value={`${Math.max(hp, 0)}/3`} critical={hp <= 1} />
        <HudChip label="Hint" value={`${hintsLeft}/2`} critical={hintsLeft === 0} />
      </div>
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <HudChip label="Timer" value={formatTime(elapsedMs)} />
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 lg:max-w-52">
          <div className="h-full rounded-full bg-[var(--accent,#6aa8ff)] transition-all" style={{ width: `${((currentDungeonIndex + 1) / 6) * 100}%` }} />
        </div>
      </div>
    </section>
  )
}

function HudChip({ label, value, critical = false }: { label: string; value: string; critical?: boolean }) {
  return (
    <div className={`rounded-full border px-3 py-1 text-sm ${critical ? 'border-rose-400/40 bg-rose-500/10 text-rose-200' : 'border-white/10 bg-black/20 text-slate-200'}`}>
      <span className="mr-1 text-white/45">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}
