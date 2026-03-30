import { Schema, model } from 'mongoose'

const leadCaptureSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: false, trim: true, maxlength: 80 },
    interest: { type: String, required: false, trim: true, maxlength: 40 },
    consent: { type: Boolean, required: true },
    mode: { type: String, required: true },
    classId: { type: String, required: true },
    classLabel: { type: String, required: true },
    resultType: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    remainingHp: { type: Number, required: true, min: 0 },
    hintsUsed: { type: Number, required: true, min: 0 },
    strongAreas: { type: [String], required: true },
    weakAreas: { type: [String], required: true },
    technicalTags: { type: [String], required: true },
  },
  { timestamps: true },
)

leadCaptureSchema.index({ email: 1, createdAt: -1 })

export const LeadCaptureModel = model('LeadCapture', leadCaptureSchema)
