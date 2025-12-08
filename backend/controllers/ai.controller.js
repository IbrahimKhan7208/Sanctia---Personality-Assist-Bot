import { llmCall } from "../ai.service.js";

export const aiController = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.send("Prompt required!");
  }

  try {
    const response = await llmCall(text);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
