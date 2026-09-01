import { useGeminiKey } from "../context/GeminiKeyContext";
import {
  askGemini as ask,
  generateStudySteps as generateSteps,
  explainStudyStep as explainStep,
} from "./gemini";

export const useGemini = () => {
  const { geminiKey } = useGeminiKey();

  return {
    askGemini: (messages) =>
      ask(messages, geminiKey),

    generateStudySteps: (title, description) =>
      generateSteps(title, description, geminiKey),

    explainStudyStep: (
      title,
      description,
      completedSteps,
      selectedStep
    ) =>
      explainStep(
        title,
        description,
        completedSteps,
        selectedStep,
        geminiKey
      ),
  };
};