interface BootstrapMessageProps {
  title: string
  body: string
  ctaLabel?: string
  onCta?: () => void
}

export function BootstrapMessage({ title, body, ctaLabel, onCta }: BootstrapMessageProps) {
  return (
    <section className="mx-auto flex flex-1 items-center justify-center">
      <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">Bootstrap applicazione</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-300">{body}</p>
        {ctaLabel && onCta ? (
          <button className="primary-button mt-6" onClick={onCta}>
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
