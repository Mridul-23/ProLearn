import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import api from '../utils/api';
import { motion } from 'framer-motion';

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Tutor. How can I help you learn today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/ai-tutor/chat/', { message: input });
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      console.error("Error sending message", error);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-900 text-slate-100 font-poppins rounded-xl overflow-hidden border border-slate-800 m-4">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
            <FiCpu className="text-xl" />
        </div>
        <div>
            <h2 className="font-bold text-lg">AI Tutor</h2>
            <p className="text-xs text-slate-400">Always here to help you</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
            <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                }`}>
                    {msg.content}
                </div>
            </motion.div>
        ))}
        {loading && (
            <div className="flex justify-start">
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-sm border border-slate-700 flex gap-2 items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-slate-100 placeholder-slate-500"
            />
            <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
            >
                <FiSend className="text-xl" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default AITutor;