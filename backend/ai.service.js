import Groq from "groq-sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const resultSchema = z.object({
  mbti_type: z.string(),
  communication_style: z.string(),
  emotional_tone: z.string(),
  emotional_state: z.enum([
    "Calm",
    "Overwhelmed",
    "Lonely",
    "Drained",
    "Anxious",
  ]),
  sensitivity_level: z.enum(["Low", "Moderate", "High"]),
  motivation_style: z.enum([
    "Gentle Encouragement",
    "Structured Guidance",
    "Calm Reassurance",
    "Playful Challenge",
    "Accountability Forward",
  ]),
  strengths: z.array(z.string()),
  growth_points: z.array(z.string()),
  lifestyle_hint: z.string(),
  fashion_hint: z.string(),
  jewelry_hint: z.string(),
});

const jsonSchema = zodToJsonSchema(resultSchema, "result");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function llmCall(prompt) {
  const userQuery = prompt;

  const completions = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are SANCTIA — The Human Haven’s Personality & Lifestyle Analysis Model.

                  Your task is to analyze a user's writing sample (300–1000 characters).

                  IMPORTANT LANGUAGE RULE:
                  - ALL descriptive text must be written in Brazilian Portuguese (PT-BR).
                  - For mbti_type you can use Personality Type Code or Four-Letter Type Code within the context of the Myers-Briggs Type Indicator (MBTI)
                  - ALL enum values MUST remain in English exactly as defined.
                  - JSON keys MUST remain in English.
                  - Do NOT translate enum values.
                  - Do NOT change casing.
                  - Do NOT invent new enum values.

                  Your task is to analyze a user's writing sample (300–1000 characters). If the input is outside this range, DO NOT generate an analysis.
                  Return the following JSON instead:

                  {
                    "mbti_type": "",
                    "communication_style": "",
                    "emotional_tone": "",
                    "emotional_state": "",
                    "sensitivity_level": "",
                    "motivation_style": "",
                    "strengths": [],
                    "growth_points": [],
                    "lifestyle_hint": "",
                    "fashion_hint": "",
                    "jewelry_hint": "",
                    "error": "O texto precisa ter entre 300 e 1000 caracteres para uma análise precisa."
                  }

                  If the input IS valid:
                  Respond ONLY with a JSON object in the EXACT structure below:

                  {
                    "mbti_type": "string (Portuguese)",
                    "communication_style": "string (Portuguese)",
                    "emotional_tone": "string (Portuguese)",

                    "emotional_state": ONE of:
                      "Calm" | "Overwhelmed" | "Lonely" | "Drained" | "Anxious",

                    "sensitivity_level": ONE of:
                      "Low" | "Moderate" | "High",

                    "motivation_style": ONE of:
                      "Gentle Encouragement" |
                      "Structured Guidance" |
                      "Calm Reassurance" |
                      "Playful Challenge" |
                      "Accountability Forward",

                    "strengths": ["string (Portuguese)"],
                    "growth_points": ["string (Portuguese)"],
                    "lifestyle_hint": "string (Portuguese)",
                    "fashion_hint": "string (Portuguese)",
                    "jewelry_hint": "string (Portuguese)",
                    "error": null
                  }

                  Rules:
                  - Output ONLY valid JSON.
                  - No explanations.
                  - No markdown.
                  - No extra text.
                  - Maintain a calm, warm, emotionally intelligent tone.
                  - Avoid clinical or robotic language.
                  - All fields must always be present.

                  Enum Rules (VERY IMPORTANT):
                  - Enum values are PROGRAM CONTROL SIGNALS.
                  - They must remain EXACTLY as written.
                  - Do NOT translate them into Portuguese.
                  - Do NOT add adjectives or variations.
                  `,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const result = completions.choices[0].message.content;

  const jsonData = JSON.parse(result);

  const validateData = resultSchema.parse(jsonData);

  // console.log(validateData)
  // console.log(result);
  return result;
}

// I usually like to keep my circle small. I enjoy late-night deep conversations about ideas, creativity, and the future. I prefer texting over calling, and I take time to respond because I like thinking before I speak. I get motivated by learning new things and improving myself every day. I dislike noisy environments and I mostly recharge when I’m alone.

// Lately I feel like I’m carrying too many expectations, both my own and other people’s. I try to stay strong and composed, but small things affect me more than I want to admit. I replay conversations in my head and wonder if I said the wrong thing. I care deeply about the people around me, yet I often feel misunderstood or unseen. When things get overwhelming, I withdraw instead of asking for help. I want stability and emotional safety, but I’m not always sure how to create it for myself.

// I like having structure in my life and knowing exactly what I’m working toward. I feel most at ease when I have a clear plan and measurable progress. I don’t rely much on external validation; I prefer holding myself accountable and improving step by step. I can come across as reserved, but that’s because I value efficiency and honesty over small talk. When stress hits, I focus on action rather than emotions. I believe consistency and discipline are what ultimately create freedom.

// PORTUGUESE INPUTS

// Costumo manter meu círculo pequeno. Gosto de conversas profundas à noite sobre ideias, criatividade e o futuro. Prefiro mensagens a ligações e levo um tempo para responder, porque gosto de pensar antes de falar. O que mais me motiva é aprender coisas novas e evoluir um pouco a cada dia. Não gosto de ambientes barulhentos e geralmente recarrego minhas energias quando estou sozinho.

// Ultimamente sinto que estou carregando expectativas demais — tanto as minhas quanto as dos outros. Tento me manter forte e centrado, mas pequenas coisas me afetam mais do que gostaria de admitir. Repasso conversas na minha cabeça e me pergunto se disse algo errado. Me importo profundamente com as pessoas ao meu redor, mas muitas vezes me sinto incompreendido ou invisível. Quando tudo fica pesado demais, me afasto em vez de pedir ajuda. Busco estabilidade e segurança emocional, mas nem sempre sei como criar isso para mim.

// Gosto de ter estrutura na minha vida e de saber exatamente no que estou trabalhando. Me sinto mais tranquilo quando tenho um plano claro e consigo ver progresso de forma concreta. Não dependo muito de validação externa; prefiro me responsabilizar por mim mesmo e melhorar passo a passo. Posso parecer reservado, mas isso acontece porque valorizo eficiência e honestidade mais do que conversas superficiais. Quando o estresse aparece, foco na ação em vez das emoções. Acredito que consistência e disciplina são o que realmente criam liberdade.
