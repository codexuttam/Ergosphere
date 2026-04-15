import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Eraser, Camera, Flag, Clock } from 'lucide-react';
import axios from 'axios';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const startTime = performance.now();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/books/ask/', { question: input });
      setOutput(response.data.answer);
      const endTime = performance.now();
      setLatency(Number(((endTime - startTime) / 1000).toFixed(2)));
    } catch (error) {
       setOutput("Error connecting to intelligence nodes. Please verify backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setLatency(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dual Pane Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="glass-morphism rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            INP
          </div>
          <div className="p-4 relative h-64">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="This is the beginning of a new journey..."
              className="w-full h-full bg-transparent border-none text-white focus:outline-none resize-none text-lg font-medium placeholder:text-slate-700"
            />
            <div className="absolute bottom-4 right-4 animate-pulse">
                <div className="w-6 h-6 bg-emerald-500 rounded-full blur-[8px] opacity-40"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-2 left-2"></div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="glass-morphism rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            OUTPUT
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {loading ? (
               <div className="flex flex-col gap-2">
                 <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse"></div>
                 <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                 <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse"></div>
               </div>
            ) : (
                <div className="relative h-full">
                    <p className="text-slate-200 text-lg leading-relaxed font-medium">
                        {output || "Awaiting intelligence synthesis..."}
                    </p>
                    {latency && (
                        <div className="absolute bottom-0 right-0 flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase font-bold bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/10">
                            <Clock className="w-3 h-3" />
                            Latency: {latency}s
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Toolbar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={handleClear}
          className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest transition-all"
        >
          <Eraser className="w-4 h-4" />
          Clear
        </button>
        
        <button 
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center gap-2 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-600/20 col-span-1"
        >
          {loading ? "Processing..." : "Submit"}
          {!loading && <Send className="w-4 h-4" />}
        </button>

        <button className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest transition-all">
          <Camera className="w-4 h-4" />
          Screenshot
        </button>

        <button className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest transition-all">
          <Flag className="w-4 h-4" />
          Flag
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
