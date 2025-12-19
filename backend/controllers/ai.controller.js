import { json } from "zod";
import { llmCall } from "../ai.service.js";
import entryModel from "../models/entry.js";

export const aiController = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.json({
    error: "O texto está vazio. Escreva alguns pensamentos para iniciar a análise.",
  });
  }

  if (text.length < 300 || text.length > 1000) {
    return res.json({
      mbti_type: "",
      communication_style: "",
      emotional_tone: "",
      emotional_state: "",
      sensitivity_level: "",
      motivation_style: "",
      strengths: [],
      growth_points: [],
      lifestyle_hint: "",
      fashion_hint: "",
      jewelry_hint: "",
      error:
        "O texto precisa ter entre 300 e 1000 caracteres para uma análise precisa.",
    });
  }

  try {
    const response = await llmCall(text);
    console.log(response);

    if(response.error){
      return res.json(response)
    }

    const entry = await entryModel.create({
      userId: req.user.id,
      text,
      mbti_type: response.mbti_type,
      communication_style: response.communication_style,
      emotional_tone: response.emotional_tone,
      strengths: response.strengths,
      growth_points: response.growth_points,
      lifestyle: response.lifestyle,
      fashion: response.fashion,
      jewelry: response.jewelry,

      emotional_state: response.emotional_state,
      sensitivity_level: response.sensitivity_level,
      motivation_style: response.motivation_style,
    });

    console.log("ENTRY: ", entry);
    res.send(response);
  } catch (err) {
    console.error("LLM ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
