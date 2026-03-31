import type { FormEvent } from 'react'

import { formatTime, humanizeTag, sortLeaderboard } from '../lib/game'
import type { FinalReport, GameClass, LeaderboardRecord, LeadFormState, ResultType } from '../types'

interface EndScreenProps {
  gameClass: GameClass
  report: FinalReport
  shareCopy: string
  copiedShare: boolean
  onShare: () => void
  leadForm: LeadFormState
  onLeadChange: (state: LeadFormState) => void
  onLeadSubmit: (event: FormEvent<HTMLFormElement>) => void
  leadStatus: 'idle' | 'submitting' | 'success' | 'error'
  onSkipLead: () => void
  onRetry: () => void
  onSwitchClass: () => void
  leaderboard: LeaderboardRecord[]
  eventPlacement: number | null
  durationLabel: string
}

export function EndScreen({
  gameClass,
  report,
  shareCopy,
  copiedShare,
  onShare,
  leadForm,
  onLeadChange,
  onLeadSubmit,
  leadStatus,
  onSkipLead,
  onRetry,
  onSwitchClass,
  leaderboard,
  eventPlacement,
  durationLabel,
}: EndScreenProps) {
  const titleMap: Record<ResultType, string> = {
    perfect_win: 'Stackoria e salva.',
    hard_fought_win: 'Hai salvato Stackoria all ultimo respiro.',
    heroic_defeat: 'Sei caduto nel raid, ma non invano.',
  }

  const subtitleMap: Record<ResultType, string> = {
    perfect_win: 'Hai dominato il raid con disciplina tecnica e sangue freddo.',
    hard_fought_win: 'Non e stata elegante. E stata eroica.',
    heroic_defeat: 'Il report e gia utile, e il prossimo tentativo pure.',
  }

  return (
    <section className="space-y-6 pb-10">
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-[var(--accent-glow,#1b2448)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Esito finale</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-white">{titleMap[report.resultType]}</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-200">{subtitleMap[report.resultType]}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultPill label="Classe" value={report.classLabel} accent={gameClass.palette.accent} />
            <ResultPill label="Archetipo" value={report.archetype} accent={gameClass.palette.accent} />
            <ResultPill label="Score" value={`${report.score}`} accent={gameClass.palette.accent} />
            <ResultPill label="Tempo" value={durationLabel} accent={gameClass.palette.accent} />
          </div>
          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Vite residue: {report.remainingHp}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Hint usati: {report.hintsUsed}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Stack: {report.stackLabel}</span>
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Share preview</p>
              <p className="mt-3 text-base leading-7 text-slate-200">{shareCopy}</p>
              <button className="primary-button mt-5" onClick={onShare}>
                {copiedShare ? 'Copiato' : 'Condividi il risultato'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Il tuo report di raid</p>
          <div className="mt-5 grid gap-4">
            <ReportBlock title="Punti forti" items={report.strongAreas.length ? report.strongAreas : ['Decisione rapida sotto pressione', 'Capacita di sintesi tecnica']} />
            <ReportBlock title="Aree da rinforzare" items={report.weakAreas.length ? report.weakAreas : ['Nessuna criticita evidente emersa nella run']} />
            <ReportBlock title="Tag tecnici" items={report.technicalTags.slice(0, 6)} />
            <ReportBlock title="Contenuti consigliati" items={report.recommendedContent} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">


        <div className="space-y-5">
          {leaderboard.length > 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Leaderboard evento</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Classifica di Stackoria</h3>
                </div>
                {eventPlacement ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100">
                    Posizione provvisoria: #{eventPlacement}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                {sortLeaderboard(leaderboard).slice(0, 5).map((record, index) => (
                  <div key={record.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">#{index + 1} {record.nickname}</p>
                      <p className="text-sm text-slate-400">{record.classLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{record.score}</p>
                      <p className="text-sm text-slate-400">{formatTime(record.completionMs)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Prossima mossa</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{report.recommendedCta}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Se vuoi, puoi tornare nei dungeon con la stessa classe o cambiare completamente build mentale e tentare un nuovo raid.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="primary-button" onClick={onRetry}>
                Riprova subito
              </button>
              <button className="secondary-button" onClick={onSwitchClass}>
                Gioca un altra classe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResultPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-2 text-base font-semibold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

function ReportBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            {humanizeTag(item)}
          </li>
        ))}
      </ul>
    </div>
  )
}
