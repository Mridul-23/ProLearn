import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { clearAuthTokens } from "../utils/api";
import { useGeminiKey } from "./GeminiKeyContext";
import { useChat } from "./ChatContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearGeminiKey } = useGeminiKey();
  const { refreshChat } = useChat();

  const logout = useCallback(() => {
    clearAuthTokens();
    clearGeminiKey();
    refreshChat();
    setUser(null);
  }, [clearGeminiKey, refreshChat]);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (
        !localStorage.getItem("access_token") ||
        !localStorage.getItem("refresh_token")
      ) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/user/profile/");
        if (isMounted) setUser(data);
      } catch {
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const handleSessionExpired = () => {
      clearAuthTokens();
      clearGeminiKey();
      refreshChat();
      if (isMounted) setUser(null);
    };

    window.addEventListener("auth:logout", handleSessionExpired);
    restoreSession();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:logout", handleSessionExpired);
    };
  }, [logout, clearGeminiKey, refreshChat]);

  const login = async (username, password) => {
    try {
      const response = await api.post(
        "/user/login/",
        { username, password },
        { skipAuth: true },
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const { data } = await api.get("/user/profile/");
      setUser(data);

      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const signup = async (username, password) => {
    try {
      await api.post(
        "/user/signup/",
        { username, password },
        { skipAuth: true },
      );

      return true;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
