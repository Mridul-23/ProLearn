import { GoogleGenAI, Type } from "@google/genai";

const MODEL = "gemini-3.5-flash-lite";

const getAI = (apiKey) => {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  return new GoogleGenAI({ apiKey });
};

const getFallbackSteps = (title) => [
  `Introduction to ${title}`,
  `Core concepts of ${title}`,
  `Practice ${title} basics`,
  `Build with ${title}`,
  `Review ${title}`,
];

export async function askGemini(messages, apiKey) {
  const ai = getAI(apiKey);

  const contents = messages.map(({ role, content }) => ({
    role: role === "assistant" ? "model" : "user",
    parts: [{ text: content }],
  }));

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: `
You are ProLearn's AI Tutor.

Be concise, accurate, clear, and educational.
Answer directly.
Do not reveal internal reasoning.
Use examples when useful.
      `,
    },
  });

  return response.text?.trim() || "";
}

export async function generateStudySteps(
  title,
  description,
  apiKey
) {
  try {
    if (!apiKey) {
      return getFallbackSteps(title);
    }

    const ai = getAI(apiKey);

    const response = await ai.models.generateContent({
      model: MODEL,

      contents: `
Create exactly 5 ordered study steps.

Title: ${title}
Description: ${description}

Each step must be 2-5 words.
Make the steps practical and progressively ordered.
      `,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const steps = JSON.parse(response.text);

    if (
      !Array.isArray(steps) ||
      steps.length !== 5 ||
      !steps.every(
        (step) =>
          typeof step === "string" &&
          step.trim()
      )
    ) {
      throw new Error("Invalid study steps from Gemini");
    }

    return steps;
  } catch (error) {
    console.warn(
      "Gemini unavailable, using fallback study steps:",
      error
    );

    return getFallbackSteps(title);
  }
}