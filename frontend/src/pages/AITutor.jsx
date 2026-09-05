import { useEffect, useRef, useState } from "react";
import { FiCpu, FiSend, FiBookmark, FiRefreshCw } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

import { useGemini } from "../services/useGemini";
import { useChat } from "../context/ChatContext";
import api from "../utils/api";

const AITutor = () => {
  const { askGemini } = useGemini();

  const { messages, updateMessages, refreshChat } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedMessages, setSavedMessages] = useState(new Map());

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSaveMessage = async (message, index) => {
    const previousUserMessage = messages[index - 1];

    try {
      if (savedMessages.has(index)) {
        const resource = savedMessages.get(index);
        await api.delete(`/api/resources/${resource.id}/`);
        setSavedMessages((prev) => {
          const next = new Map(prev);
          next.delete(index);
          return next;
        });
        return;
      }

      const { data } = await api.post("/api/resources/", {
        title: previousUserMessage
          ? `AI Tutor: ${previousUserMessage.content.slice(0, 80)}`
          : "AI Tutor Note",
        url: null,
        resource_type: "ai_note",
        description: message.content,
      });

      setSavedMessages((prev) => {
        const next = new Map(prev);
        next.set(index, data);
        return next;
      });
    } catch (error) {
      console.error("Failed to toggle AI note:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const conversation = [...messages, userMessage].slice(-12);

    updateMessages(userMessage);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGemini(conversation);
      updateMessages({
          role: "assistant",
          content: reply || "I could not generate a response.",
        });
    } catch (error) {
      console.error("Gemini error:", error);
      updateMessages({
          role: "assistant",
          content: "Please add your Gemini API key to use the AI Tutor.",
        });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        handleSend(e);
      }
    }
  };

  const handleRefresh = () => {
    refreshChat();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] sm:h-[calc(100vh-6rem)] bg-slate-900/60 backdrop-blur-xl text-slate-100 font-poppins overflow-hidden border border-slate-800/80 shadow-2xl">
      
      {/* Header */}
      <div className="bg-slate-950/60 p-3 sm:p-4 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
        <div className="flex gap-3 items-center">
        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
          <FiCpu className="text-xl text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-white tracking-wide">AI Tutor</h2>
          <p className="text-xs text-slate-400">
            Ask questions and learn interactively
          </p>
        </div>
        </div>
        <button type="button" onClick={handleRefresh} className="group flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 hover:border-indigo-500/30 active:scale-95 transition-all duration-200">
          <FiRefreshCw className="text-indigo-400 transition-transform duration-500 group-hover:rotate-180" />
          <span className="hidden sm:inline">Refresh Chat</span>
        </button>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 theme-scroll"
      >
        {messages.map((message, index) => (
          <motion.div
            key={`${message.role}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`min-w-0 max-w-[92%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                message.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm shadow-indigo-600/10"
                  : "bg-slate-950/70 text-slate-200 border border-slate-800/80 rounded-bl-sm backdrop-blur-sm"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-invert break-words prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-bold mb-2 text-white">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-bold mb-2 text-white">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0 leading-relaxed text-slate-300">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc ml-5 mb-2 space-y-1 text-slate-300">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-5 mb-2 space-y-1 text-slate-300">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 text-xs border border-slate-800">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-slate-950 border border-slate-800 break-words rounded-xl p-3 overflow-x-auto my-2 theme-scroll">
                            <code className="text-xs text-slate-200">
                              {children}
                            </code>
                          </pre>
                        ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-indigo-500 pl-3 italic text-slate-400 my-2">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  
                  {index > 0 && (
                    <button
                      onClick={() => handleSaveMessage(message, index)}
                      className={`mt-4 flex items-center gap-1.5 text-xs font-medium transition-all ${
                        savedMessages.has(index)
                          ? "text-emerald-400 hover:text-rose-400"
                          : "text-slate-400 hover:text-indigo-400"
                      }`}
                      title={
                        savedMessages.has(index)
                          ? "Remove from Resources"
                          : "Save to Resources"
                      }
                    >
                      <FiBookmark className="text-sm" />
                      {savedMessages.has(index)
                        ? "Saved to Resources"
                        : "Save to Resources"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words leading-relaxed text-white">
                  {message.content}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-950/70 px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-800/80 flex items-center gap-2 backdrop-blur-sm">
              <FiCpu className="text-indigo-400" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-md"
      >
        <div className="flex gap-2 sm:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={
              loading ? "AI Tutor is responding..." : "Ask me anything..."
            }
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-slate-100 placeholder-slate-500 disabled:opacity-60 shadow-inner"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center font-medium"
            aria-label="Send message"
          >
            <FiSend className="text-lg" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
};

export default AITutor;