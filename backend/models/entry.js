import mongoose from "mongoose";

const entrySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: String,
  mbti_type: String,
  communication_style: String,
  emotional_tone: String,
  strengths: [String],
  growth_points: [String],
  lifestyle: String,
  fashion: String,
  jewelry: String,

  emotional_state: String,
  sensitivity_level: String,
  motivation_style: String,
}, { timestamps: true });

export default mongoose.model("entry", entrySchema)