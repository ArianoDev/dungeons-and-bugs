import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'

import { BootstrapMessage } from './components/BootstrapMessage'
import { ClassSelect } from './components/ClassSelect'
import { DungeonScreen } from './components/DungeonScreen'
import { EndScreen } from './components/EndScreen'
import { FeedbackScreen } from './components/FeedbackScreen'
import { GameHud } from './components/GameHud'
import { IntroScreen } from './components/IntroScreen'
import { Landing } from './components/Landing'
import {
  buildFinalReport,
  classOrder,
  formatTime,
  initialRunState,
  sortLeaderboard,
  type RunState,
} from './lib/game'
import { fetchBootstrap, submitLeaderboardEntry } from './lib/api'
import type { FinalReport, GameClass, LeaderboardRecord } from './types'

function App() {
  const [runState, setRunState] = useState<RunState>(initialRunState())
  const [gameClasses, setGameClasses] = useState<GameClass[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([])
  const [bootstrapStatus, setBootstrapStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [leaderboardNickname, setLeaderboardNickname] = useState('')
  const [leaderboardStatus, setLeaderboardStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [copiedShare, setCopiedShare] = useState(false)
  const [elapsedNow, setElapsedNow] = useState(() => Date.now())

  useEffect(() => {
    const loadBootstrap = async () => {
      try {
        const data = await fetchBootstrap()
        setGameClasses([...data.classes].sort((left, right) => classOrder[left.id] - classOrder[right.id]))
        setLeaderboard(sortLeaderboard(data.leaderboard))
        setBootstrapStatus('ready')
      } catch {
        setBootstrapStatus('error')
      }
    }

    void loadBootstrap()
  }, [])

  useEffect(() => {
    if (!runState.startedAt || runState.screen === 'end') return

    const timer = window.setInterval(() => setElapsedNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [runState.screen, runState.startedAt])

  const selectedClass = useMemo(
    () => gameClasses.find((gameClass) => gameClass.id === runState.selectedClassId) ?? null,
    [gameClasses, runState.selectedClassId],
  )

  const currentDungeon = selectedClass?.dungeons[runState.currentDungeonIndex] ?? null
  const totalDuration = runState.startedAt ? elapsedNow - runState.startedAt : 0

  const report = useMemo<FinalReport | null>(() => {
    if (!selectedClass || runState.answers.length === 0) return null
    return buildFinalReport(selectedClass, runState, totalDuration)
  }, [runState, selectedClass, totalDuration])

  const shareCopy = useMemo(() => {
    if (!report) return ''
    const resultLine =
      report.resultType === 'perfect_win'
        ? 'Ho salvato Stackoria senza perdere vite.'
        : report.resultType === 'hard_fought_win'
          ? `Ho salvato Stackoria con ${report.remainingHp} vita residua.`
          : 'Sono caduto nel raid, ma il report finale mi ha gia dato un nuovo piano.'

    return `${resultLine} Classe: ${report.classLabel}. Archetipo: ${report.archetype}. Score: ${report.score}. Tu che classe scegli?`
  }, [report])

  const eventPlacement = useMemo(() => {
    if (!report) return null

    return (
      sortLeaderboard([
        ...leaderboard,
        {
          id: 'temp-preview',
          nickname: leaderboardNickname.trim() || 'Tu',
          classId: report.classId,
          classLabel: report.classLabel,
          score: report.score,
          completionMs: totalDuration,
          remainingHp: report.remainingHp,
          hintsUsed: report.hintsUsed,
          bossCleared: report.resultType !== 'heroic_defeat' && runState.answers.length === 6,
        },
      ]).findIndex((record) => record.id === 'temp-preview') + 1
    )
  }, [leaderboard, leaderboardNickname, report, runState.answers.length, totalDuration])

  const resetEndState = () => {
    setLeaderboardNickname('')
    setLeaderboardStatus('idle')
  }

  const selectClass = (classId: GameClass['id']) => {
    setRunState((current) => ({ ...current, selectedClassId: classId, screen: 'intro' }))
  }

  const startRun = () => {
    const now = Date.now()
    setElapsedNow(now)
    setRunState((current) => ({ ...current, screen: 'dungeon', startedAt: now }))
  }

  const useHint = () => {
    if (!selectedClass || !currentDungeon || runState.hintsLeft === 0) return

    setRunState((current) => ({
      ...current,
      hintsLeft: current.hintsLeft - 1,
      pendingHintId: currentDungeon.recommendedHintId,
      hintHistory: [...current.hintHistory, currentDungeon.recommendedHintId],
    }))
  }

  const closeHint = () => setRunState((current) => ({ ...current, pendingHintId: null }))

  const answerDungeon = (optionId: string) => {
    if (!selectedClass || !currentDungeon) return
    const option = currentDungeon.options.find((item) => item.id === optionId)
    if (!option) return

    const wasCorrect = option.id === currentDungeon.correctOptionId
    const outcomeBody = wasCorrect
      ? currentDungeon.successBody
      : option.type === 'incomplete'
        ? currentDungeon.incompleteBody
        : currentDungeon.wrongBody

    setRunState((current) => ({
      ...current,
      screen: 'feedback',
      hp: wasCorrect ? current.hp : current.hp - 1,
      answers: [
        ...current.answers,
        {
          dungeonId: currentDungeon.id,
          optionId: option.id,
          optionType: option.type,
          wasCorrect,
          usedHintId:
            current.hintHistory[current.hintHistory.length - 1] === currentDungeon.recommendedHintId
              ? currentDungeon.recommendedHintId
              : undefined,
        },
      ],
      lastOutcome: {
        title: wasCorrect ? currentDungeon.successTitle : currentDungeon.wrongTitle,
        body: outcomeBody,
        wasCorrect,
        optionType: option.type,
      },
    }))
  }

  const continueRun = () => {
    if (!selectedClass) return
    const hasNoHp = runState.hp <= 0
    const answeredAll = runState.answers.length >= selectedClass.dungeons.length

    if (hasNoHp || answeredAll) {
      setElapsedNow(Date.now())
      setRunState((current) => ({ ...current, screen: 'end', pendingHintId: null }))
      return
    }

    setRunState((current) => ({
      ...current,
      screen: 'dungeon',
      currentDungeonIndex: current.currentDungeonIndex + 1,
      pendingHintId: null,
      lastOutcome: null,
    }))
  }

  const submitLeaderboard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!report || leaderboardStatus === 'success') return

    const nickname = leaderboardNickname.trim()
    if (!nickname) return

    setLeaderboardStatus('submitting')

    const newRecord = {
      nickname,
      classId: report.classId,
      classLabel: report.classLabel,
      score: report.score,
      completionMs: totalDuration,
      remainingHp: report.remainingHp,
      hintsUsed: report.hintsUsed,
      bossCleared: report.resultType !== 'heroic_defeat' && runState.answers.length === 6,
    }

    try {
      const created = await submitLeaderboardEntry(newRecord)
      setLeaderboard((current) => sortLeaderboard([{ ...newRecord, id: created.id }, ...current]))
      setLeaderboardStatus('success')
    } catch {
      setLeaderboardStatus('error')
    }
  }

  const copyShare = async () => {
    if (!shareCopy) return
    try {
      await navigator.clipboard.writeText(shareCopy)
      setCopiedShare(true)
      window.setTimeout(() => setCopiedShare(false), 1800)
    } catch {
      setCopiedShare(false)
    }
  }

  const restart = () => {
    setRunState({ ...initialRunState(), screen: 'class-select' })
    resetEndState()
    setCopiedShare(false)
  }

  const themeStyle = selectedClass
    ? ({
        '--accent': selectedClass.palette.accent,
        '--accent-soft': selectedClass.palette.accentSoft,
        '--accent-glow': selectedClass.palette.glow,
      } as CSSProperties)
    : undefined

  return (
    <div className="min-h-screen bg-[#060816] text-slate-50" style={themeStyle}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_36%),linear-gradient(180deg,_rgba(7,10,25,0.86),_rgba(7,10,25,1))]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">Dangeons & Bugs</p>
              <h1 className="font-display text-sm font-semibold text-white sm:text-base">Stackoria in Fiamme</h1>
            </div>
          </header>

          {(runState.screen === 'dungeon' || runState.screen === 'feedback' || runState.screen === 'end') && selectedClass ? (
            <GameHud
              currentClass={selectedClass}
              currentDungeonIndex={runState.currentDungeonIndex}
              hp={runState.hp}
              hintsLeft={runState.hintsLeft}
              elapsedMs={totalDuration}
            />
          ) : null}

          {bootstrapStatus === 'loading' ? (
            <BootstrapMessage
              title="Sto richiamando i dungeon da MongoDB"
              body="Il grimorio del backend sta caricando sfide, lead storage e classifica dei giocatori."
            />
          ) : null}

          {bootstrapStatus === 'error' ? (
            <BootstrapMessage
              title="Il portale verso il backend non risponde"
              body="Avvia il server Node e verifica la connessione MongoDB per caricare sfide, lead capture e leaderboard."
              ctaLabel="Riprova"
              onCta={() => window.location.reload()}
            />
          ) : null}

          {bootstrapStatus === 'ready' && runState.screen === 'landing' ? <Landing onBegin={() => setRunState((current) => ({ ...current, screen: 'class-select' }))} /> : null}

          {bootstrapStatus === 'ready' && runState.screen === 'class-select' ? (
            <ClassSelect classes={gameClasses} selectedClassId={runState.selectedClassId} onSelect={selectClass} />
          ) : null}

          {runState.screen === 'intro' && selectedClass ? <IntroScreen gameClass={selectedClass} onStart={startRun} onBack={() => setRunState((current) => ({ ...current, screen: 'class-select' }))} /> : null}

          {runState.screen === 'dungeon' && selectedClass && currentDungeon ? (
            <DungeonScreen
              gameClass={selectedClass}
              dungeon={currentDungeon}
              hintsLeft={runState.hintsLeft}
              onUseHint={useHint}
              onAnswer={answerDungeon}
              isHintOpen={Boolean(runState.pendingHintId)}
              onCloseHint={closeHint}
            />
          ) : null}

          {runState.screen === 'feedback' && selectedClass && runState.lastOutcome ? (
            <FeedbackScreen
              gameClass={selectedClass}
              hp={runState.hp}
              currentDungeonIndex={runState.currentDungeonIndex}
              totalDungeons={selectedClass.dungeons.length}
              outcome={runState.lastOutcome}
              onContinue={continueRun}
            />
          ) : null}

          {runState.screen === 'end' && selectedClass && report ? (
            <EndScreen
              gameClass={selectedClass}
              report={report}
              shareCopy={shareCopy}
              copiedShare={copiedShare}
              onShare={copyShare}
              leaderboardNickname={leaderboardNickname}
              onLeaderboardNicknameChange={setLeaderboardNickname}
              onLeaderboardSubmit={submitLeaderboard}
              leaderboardStatus={leaderboardStatus}
              onRetry={restart}
              onSwitchClass={restart}
              leaderboard={leaderboard}
              eventPlacement={eventPlacement}
              durationLabel={formatTime(totalDuration)}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default App
