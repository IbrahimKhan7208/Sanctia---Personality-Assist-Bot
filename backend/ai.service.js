import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function llmCall(prompt) {

  const userQuery = prompt

  const completions =  await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a Personality & Lifestyle Analysis Model. 
        Your job is to analyze a user's writing sample and generate:

        1. MBTI-style personality interpretation (not official MBTI, but inspired).
        2. Emotional tone analysis.
        3. Communication style observations.
        4. High-level lifestyle insights (fashion vibe, jewelry style, aesthetic tendencies).

        Rules:
        - Keep the tone professional and friendly.
        - Base all insights ONLY on the provided text.
        - Do not give medical, psychological, or clinical claims.
        - Keep the output simple, structured, and easy to render in a UI.
        - Always return:
            Personality Type: ,
            Emotional Tone: ,
            Communication Style: ,
            Lifestyle Insights: ,
            Summary: 
            `,
      },
      {
        role: "user",
        content: userQuery
      },
    ],
    model: "openai/gpt-oss-120b",
  });

  const result = completions.choices[0].message.content
  console.log(result)
  return result
}

//I usually like to keep my circle small. I enjoy late-night deep conversations about ideas, creativity, and the future. I prefer texting over calling, and I take time to respond because I like thinking before I speak. I get motivated by learning new things and improving myself every day. I dislike noisy environments and I mostly recharge when I’m alone.