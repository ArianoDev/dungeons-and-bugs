interface LandingProps {
  onBegin: () => void
}

export function Landing({ onBegin }: LandingProps) {
  return (
    <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <span className="inline-flex rounded-full border border-[var(--accent,#6aa8ff)]/30 bg-[var(--accent,#6aa8ff)]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/80">
          Entra nel dungeon e mettiti alla prova
        </span>
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Vesti i panni di un eroe e salva Stackoria dalle fiamme.
          </h2>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Affronta 6 dungeon tecnici in meno di 5 minuti, salva il regno del codice e ottieni la tua ricompensa.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {['4 classi tecniche', '3 vite', '2 hint totali', 'Boss finale al 6 dungeon'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur">
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="primary-button" onClick={onBegin}>
            Entra in classifica
          </button>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-[var(--accent-glow,#1b2448)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Speedrun</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Il loop in 5 minuti</h3>
          </div>
        </div>
        <ol className="space-y-3 text-sm text-slate-300">
          {[
            'Scegli una classe tra Bardo, Druido, Paladino e Stregone.',
            'Affronta 6 dungeon in meno di 5 minuti, ognuno con una sfida tecnica unica.',
            'Supera il mostro finale, salva il regno del codice.',
            'Scala la classifica e condividi il tuo risultato',
          ].map((item, index) => (
            <li key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/90">{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
