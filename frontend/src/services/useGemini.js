import { useGeminiKey } from "../context/GeminiKeyContext";
import {
  askGemini as ask,
  generateStudySteps as generateSteps,
} from "./gemini";

export const useGemini = () => {
  const { geminiKey } = useGeminiKey();

  return {
    askGemini: (messages) =>
      ask(messages, geminiKey),

    generateStudySteps: (title, description) =>
      generateSteps(title, description, geminiKey),
  };
};