import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const FocusTimerContext = createContext(null);

export const FocusTimerProvider = ({ children }) => {
  const [duration, setDuration] = useState(30 * 60);
  const [remaining, setRemaining] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    if (remaining > 0) setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setRemaining(duration);
  };

  const changeDuration = (seconds) => {
    if (isRunning || seconds <= 0) return;
    setDuration(seconds);
    setRemaining(seconds);
  };

  const finish = async () => {
    setIsRunning(false);

    const elapsedSeconds = duration - remaining;

    if (elapsedSeconds > 0) {
      try {
        await api.post("/user/focus/", { seconds: elapsedSeconds });
      } catch (error) {
        console.error("Failed to save focus time", error);
        return false;
      }
    }

    setRemaining(duration);
    return true;
  };

  return (
    <FocusTimerContext.Provider
      value={{
        duration,
        remaining,
        isRunning,
        start,
        pause,
        reset,
        finish,
        setDuration: changeDuration,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);

  if (!context) {
    throw new Error("useFocusTimer must be used inside FocusTimerProvider");
  }

  return context;
};