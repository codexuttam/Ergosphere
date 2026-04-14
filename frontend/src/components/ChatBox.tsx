import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Book Assistant. Ask me anything about the books in our collection.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/books/ask/', { question: input });
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response.data.answer, 
        sender: 'bot',
        sources: response.data.sources
      }]);
    } catch (error) {
       setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I'm having trouble connecting to the intelligence pipeline. Please ensure the backend is running.", 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-morphism rounded-3xl flex flex-col h-[600px] overflow-hidden">
      <div className="p-6 border-b border-indigo-500/20 bg-indigo-600/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Insight Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-400">RAG Pipeline Connected</span>
            </div>
          </div>
        </div>
        <Sparkles className="text-indigo-400 w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, x: msg.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'glass-morphism text-slate-200 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.sender === 'bot' && (msg as any).sources && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Sources</p>
                      {(msg as any).sources.map((s: any, i: number) => (
                        <a key={i} href={s.url} className="text-[10px] text-indigo-400 hover:underline block truncate">
                            {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="glass-morphism p-4 rounded-2xl rounded-tl-none flex gap-2">
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-900/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about summaries, genres, or recommendations..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all glow-button"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
