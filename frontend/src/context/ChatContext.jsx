import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ChatContext = createContext(null);

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I am your AI Tutor. How can I help you learn today?",
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = sessionStorage.getItem("chat_messages");
      return savedMessages ? JSON.parse(savedMessages) : [INITIAL_MESSAGE];
    }
    catch (error) {
      console.error("Error reading sessionStorage Chat History: ", error);
      return [INITIAL_MESSAGE]
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("chat_messages", JSON.stringify(messages));
    } catch (error) {
      console.error(`Error saving chat history to sessionStorage: ${error}`);
    }
  }, [messages]);

  const updateMessages = ({ role, content }) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const refreshChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem("chat_messages");
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        updateMessages,
        refreshChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat should be used within a ChatProvider.");
  }
  return context;
};
