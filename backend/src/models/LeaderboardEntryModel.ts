import { Schema, model } from 'mongoose'

const leaderboardEntrySchema = new Schema(
  {
    seedId: { type: String, required: false },
    nickname: { type: String, required: true, trim: true, maxlength: 32 },
    classId: { type: String, required: true },
    classLabel: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    completionMs: { type: Number, required: true, min: 0 },
    remainingHp: { type: Number, required: true, min: 0 },
    hintsUsed: { type: Number, required: true, min: 0 },
    bossCleared: { type: Boolean, required: true },
    mode: { type: String, required: true, default: 'event' },
  },
  { timestamps: true },
)

leaderboardEntrySchema.index({ mode: 1, score: -1, completionMs: 1, remainingHp: -1, hintsUsed: 1 })

export const LeaderboardEntryModel = model('LeaderboardEntry', leaderboardEntrySchema)
