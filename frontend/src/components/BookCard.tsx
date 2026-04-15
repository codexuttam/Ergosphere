import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, ExternalLink } from 'lucide-react';

interface BookProps {
  book: any;
  onClick: (book: any) => void;
}

const BookCard: React.FC<BookProps> = ({ book, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={() => onClick(book)}
      className="glass-morphism premium-card rounded-[32px] overflow-hidden p-5 flex flex-col h-full group cursor-pointer"
    >
      <div className="relative h-56 mb-6 bg-slate-900/50 rounded-[24px] overflow-hidden flex items-center justify-center">
        {book.image_url ? (
          <img 
            src={book.image_url} 
            alt={book.title} 
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-slate-700 group-hover:text-indigo-400 transition-colors" />
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex gap-1.5 items-center bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-black text-yellow-400 uppercase tracking-widest">
           <Star className="w-3 h-3 fill-current" />
           <span>{book.rating} Rating</span>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="flex-1 px-1">
        <h3 className="text-2xl font-extrabold text-white leading-tight mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2 tracking-tight">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">
          Author: <span className="text-indigo-400/80">{book.author}</span>
        </p>
        <p className="text-[14px] text-slate-400 leading-relaxed line-clamp-3 mb-6 font-medium">
          {book.description || "Synthesizing descriptive metadata for this catalog entry..."}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex flex-col">
           <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Market Value</span>
           <span className="text-xl font-black text-white tracking-tight">{book.price || "£0.00"}</span>
        </div>
        <a 
          href={book.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600/10 hover:bg-indigo-600 rounded-xl transition-all text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-500 font-bold text-xs uppercase tracking-widest"
        >
          <span>Catalog</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default BookCard;
