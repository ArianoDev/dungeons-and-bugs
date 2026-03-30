import bardoImage from '../assets/Bardo.png'
import druidoImage from '../assets/Druido.png'
import paladinoImage from '../assets/Paladino.png'
import stregoneImage from '../assets/Stregone.png'
import type { GameClass } from '../types'

const classImages: Record<GameClass['id'], string> = {
  'frontend-bardo': bardoImage,
  'backend-druido': druidoImage,
  'devops-paladino': paladinoImage,
  'ai-stregone': stregoneImage,
}

interface ClassSelectProps {
  classes: GameClass[]
  selectedClassId: GameClass['id'] | null
  onSelect: (classId: GameClass['id']) => void
}

export function ClassSelect({ classes, selectedClassId, onSelect }: ClassSelectProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-white/50">Scelta della classe</p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Quale eroe sei?</h2>
        <p className="max-w-2xl text-slate-300">
          Ogni classe affronta sfide diverse, ma tutte molto reali. Scegli in fretta, lo score corre.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classes.map((gameClass) => {
          const selected = gameClass.id === selectedClassId
          return (
            <button
              key={gameClass.id}
              className={`group rounded-[1.75rem] border p-5 text-left transition ${
                selected
                  ? 'border-white/40 bg-white/10 shadow-lg shadow-black/30'
                  : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
              }`}
              onClick={() => onSelect(gameClass.id)}
              style={{
                boxShadow: selected
                  ? `0 0 0 1px ${gameClass.palette.accent} inset, 0 18px 50px ${gameClass.palette.glow}`
                  : undefined,
              }}
            >
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${gameClass.palette.accent}1f`, color: gameClass.palette.accent }}
              >
                {gameClass.stackLabel}
              </span>
              <div className="mt-4 overflow-hidden rounded-[1.35rem] ">
                <img
                  src={classImages[gameClass.id]}
                  alt={gameClass.label}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{gameClass.label}</h3>
              <p className="mt-1 text-sm tracking-[0.2em] text-white/45">{gameClass.fantasyTitle}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{gameClass.pitch}</p>
              <div className="mt-4 space-y-2 text-xs text-slate-400">
                {gameClass.hints.map((hint) => (
                  <div key={hint.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    {hint.label}
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm font-medium" style={{ color: gameClass.palette.accent }}>
                {selected ? 'Classe scelta - inizia il raid' : 'Seleziona classe'}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
