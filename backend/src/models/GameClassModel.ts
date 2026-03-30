import { Schema, model } from 'mongoose'

const answerOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
)

const hintSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
)

const dungeonSchema = new Schema(
  {
    id: { type: String, required: true },
    order: { type: Number, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    problem: { type: String, required: true },
    scenario: { type: String, required: true },
    prompt: { type: String, required: true },
    options: { type: [answerOptionSchema], required: true },
    correctOptionId: { type: String, required: true },
    recommendedHintId: { type: String, required: true },
    hintText: { type: String, required: true },
    successTitle: { type: String, required: true },
    successBody: { type: String, required: true },
    wrongTitle: { type: String, required: true },
    wrongBody: { type: String, required: true },
    incompleteBody: { type: String, required: true },
    reportTags: { type: [String], required: true },
  },
  { _id: false },
)

const gameClassSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    stackLabel: { type: String, required: true },
    fantasyTitle: { type: String, required: true },
    pitch: { type: String, required: true },
    intro: { type: String, required: true },
    palette: {
      accent: { type: String, required: true },
      accentSoft: { type: String, required: true },
      glow: { type: String, required: true },
    },
    hints: { type: [hintSchema], required: true },
    archetypes: {
      perfect: { type: String, required: true },
      gritty: { type: String, required: true },
      defeat: { type: String, required: true },
    },
    contentRecommendations: { type: [String], required: true },
    dungeons: { type: [dungeonSchema], required: true },
  },
  { timestamps: true },
)

export const GameClassModel = model('GameClass', gameClassSchema)
