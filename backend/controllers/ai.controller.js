import { json } from "zod";
import { llmCall } from "../ai.service.js";
import entryModel from "../models/entry.js";

export const aiController = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.send("Prompt required!");
  }

  try {
    const response = await llmCall(text);
    console.log(response);
    const responseJson = JSON.parse(response);

    const entry = await entryModel.create({
      userId: req.user.id,
      text,
      mbti_type: responseJson.mbti_type,
      communication_style: responseJson.communication_style,
      emotional_tone: responseJson.emotional_tone,
      strengths: responseJson.strengths,
      growth_points: responseJson.growth_points,
      lifestyle: responseJson.lifestyle,
      fashion: responseJson.fashion,
      jewelry: responseJson.jewelry,

      emotional_state: responseJson.emotional_state,
      sensitivity_level: responseJson.sensitivity_level,
      motivation_style: responseJson.motivation_style,
    });

    console.log("ENTRY: ", entry);
    res.send(response);
  } catch (err) {
    console.error("LLM ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
