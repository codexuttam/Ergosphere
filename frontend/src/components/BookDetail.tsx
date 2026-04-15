import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ExternalLink, Hash, Heart, Info, TrendingUp } from 'lucide-react';

interface BookDetailProps {
  book: any;
  onClose: () => void;
}

const BookDetail = ({ book, onClose }: BookDetailProps) => {
  if (!book) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4 lg:p-12"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="glass-morphism h-full w-full max-w-2xl rounded-[40px] overflow-y-auto p-12 relative shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="w-full md:w-64 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 shrink-0">
                <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/10">
                        {book.genre || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{book.rating}</span>
                    </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">{book.title}</h1>
                <p className="text-lg text-indigo-300 font-bold">By {book.author}</p>
                <div className="flex gap-4 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Market Value</span>
                        <span className="text-2xl font-black text-white">{book.price}</span>
                    </div>
                    <a href={book.url} target="_blank" className="ml-auto p-4 bg-indigo-600 rounded-2xl text-white hover:scale-105 transition-all">
                        <ExternalLink className="w-6 h-6" />
                    </a>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    <Heart className="w-3 h-3" /> Sentiment
                </div>
                <p className="text-xl font-bold text-white">{book.sentiment || "Neutral Analysis"}</p>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    <Hash className="w-3 h-3" /> Catalog ID
                </div>
                <p className="text-xl font-bold text-white">#EXP-00{book.id}</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest pb-2 border-b border-white/5">
                <Info className="w-3 h-3" /> Neural Synthesis Summary
             </div>
             <p className="text-lg text-slate-400 leading-relaxed font-medium">
                {book.summary || "Synthesizing deep-model insights for this document node..."}
             </p>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest pb-2 border-b border-white/5">
                <TrendingUp className="w-3 h-3" /> Document Metadata
             </div>
             <p className="text-base text-slate-500 leading-relaxed italic">
                {book.description}
             </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookDetail;
