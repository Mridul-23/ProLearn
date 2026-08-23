import { createContext, useContext, useState } from "react";

const GeminiKeyContext = createContext(null);

export const GeminiKeyProvider = ({ children }) => {
  const [geminiKey, setGeminiKey] = useState(
    () => sessionStorage.getItem("gemini_api_key") || ""
  );

  const saveGeminiKey = (key) => {
    const value = key.trim();

    setGeminiKey(value);

    if (value) {
      sessionStorage.setItem("gemini_api_key", value);
    }
  };

  const clearGeminiKey = () => {
    setGeminiKey("");
    sessionStorage.removeItem("gemini_api_key");
  };

  return (
    <GeminiKeyContext.Provider
      value={{
        geminiKey,
        saveGeminiKey,
        clearGeminiKey,
        hasGeminiKey: Boolean(geminiKey),
      }}
    >
      {children}
    </GeminiKeyContext.Provider>
  );
};

export const useGeminiKey = () => {
  const context = useContext(GeminiKeyContext);

  if (!context) {
    throw new Error(
      "useGeminiKey must be used inside GeminiKeyProvider"
    );
  }

  return context;
};