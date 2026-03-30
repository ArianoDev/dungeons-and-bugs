import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import type { Request, Response } from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import mongoose from 'mongoose'

import { seedDatabase } from './lib/seed.js'
import { GameClassModel } from './models/GameClassModel.js'
import { LeaderboardEntryModel } from './models/LeaderboardEntryModel.js'
import { LeadCaptureModel } from './models/LeadCaptureModel.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = dirname(currentFilePath)

config({ path: resolve(currentDirectory, '../.env') })

const app = express()
const port = Number(process.env.PORT ?? 4000)
const mongoUrl = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/stackoria'
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
const corsOrigins = [allowedOrigin, 'http://127.0.0.1:5173']

app.use(cors({ origin: corsOrigins }))
app.use(express.json())

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ ok: true })
})

app.get('/api/bootstrap', async (_request: Request, response: Response) => {
  const [classes, leaderboard] = await Promise.all([
    GameClassModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 }).lean(),
    LeaderboardEntryModel.find({ mode: 'event' }, { __v: 0 }).sort({ score: -1, completionMs: 1, remainingHp: -1, hintsUsed: 1 }).limit(10).lean(),
  ])

  response.json({ classes, leaderboard })
})

app.get('/api/classes', async (_request: Request, response: Response) => {
  const classes = await GameClassModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 }).lean()
  response.json(classes)
})

app.get('/api/leaderboard', async (request: Request, response: Response) => {
  const limit = Math.min(Number(request.query.limit ?? 10), 25)
  const mode = typeof request.query.mode === 'string' ? request.query.mode : 'event'

  const leaderboard = await LeaderboardEntryModel.find({ mode }, { __v: 0 })
    .sort({ score: -1, completionMs: 1, remainingHp: -1, hintsUsed: 1 })
    .limit(limit)
    .lean()

  response.json(leaderboard)
})

app.post('/api/leaderboard', async (request: Request, response: Response) => {
  const { nickname, classId, classLabel, score, completionMs, remainingHp, hintsUsed, bossCleared } = request.body as Record<string, unknown>

  if (
    typeof nickname !== 'string' ||
    typeof classId !== 'string' ||
    typeof classLabel !== 'string' ||
    typeof score !== 'number' ||
    typeof completionMs !== 'number' ||
    typeof remainingHp !== 'number' ||
    typeof hintsUsed !== 'number' ||
    typeof bossCleared !== 'boolean'
  ) {
    response.status(400).json({ message: 'Payload leaderboard non valido.' })
    return
  }

  const entry = await LeaderboardEntryModel.create({
    nickname: nickname.trim().slice(0, 32) || 'Avventuriero',
    classId,
    classLabel,
    score,
    completionMs,
    remainingHp,
    hintsUsed,
    bossCleared,
    mode: 'event',
  })

  response.status(201).json({ id: entry.id })
})

app.post('/api/leads', async (request: Request, response: Response) => {
  const {
    email,
    name,
    interest,
    consent,
    mode,
    classId,
    classLabel,
    resultType,
    score,
    remainingHp,
    hintsUsed,
    strongAreas,
    weakAreas,
    technicalTags,
  } = request.body as Record<string, unknown>

  const payloadIsValid =
    typeof email === 'string' &&
    typeof consent === 'boolean' &&
    typeof mode === 'string' &&
    typeof classId === 'string' &&
    typeof classLabel === 'string' &&
    typeof resultType === 'string' &&
    typeof score === 'number' &&
    typeof remainingHp === 'number' &&
    typeof hintsUsed === 'number' &&
    Array.isArray(strongAreas) &&
    Array.isArray(weakAreas) &&
    Array.isArray(technicalTags)

  if (!payloadIsValid || !email.includes('@') || !consent) {
    response.status(400).json({ message: 'Payload lead capture non valido.' })
    return
  }

  const lead = await LeadCaptureModel.create({
    email: email.trim().toLowerCase(),
    name: typeof name === 'string' ? name.trim().slice(0, 80) : undefined,
    interest: typeof interest === 'string' ? interest.trim().slice(0, 40) : undefined,
    consent,
    mode,
    classId,
    classLabel,
    resultType,
    score,
    remainingHp,
    hintsUsed,
    strongAreas: strongAreas.filter((item): item is string => typeof item === 'string').slice(0, 8),
    weakAreas: weakAreas.filter((item): item is string => typeof item === 'string').slice(0, 8),
    technicalTags: technicalTags.filter((item): item is string => typeof item === 'string').slice(0, 20),
  })

  response.status(201).json({ id: lead.id })
})

const bootstrap = async () => {
  await mongoose.connect(mongoUrl)
  await seedDatabase()

  app.listen(port, () => {
    console.log(`Stackoria backend listening on http://localhost:${port}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error)
  process.exit(1)
})
