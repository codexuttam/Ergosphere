import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, ExternalLink } from 'lucide-react';

interface BookProps {
  book: {
    id: number;
    title: string;
    author: string;
    description: string;
    rating: string;
    url: string;
    price?: string;
    genre?: string;
  };
}

const BookCard: React.FC<BookProps> = ({ book }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="glass-morphism premium-card rounded-2xl overflow-hidden p-4 flex flex-col h-full group"
    >
      <div className="relative h-48 mb-4 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-slate-600 group-hover:text-indigo-400 transition-colors" />
        <div className="absolute top-2 right-2 flex gap-1 items-center bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-sm text-yellow-400">
           <Star className="w-3 h-3 fill-current" />
           <span>{book.rating}</span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors">{book.title}</h3>
        <p className="text-sm text-slate-400 mb-2">by <span className="text-indigo-300">{book.author}</span></p>
        <p className="text-sm text-slate-500 line-clamp-3 mb-4">{book.description || "No description available."}</p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-indigo-400 font-bold">{book.price || "£0.00"}</span>
        <a 
          href={book.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-indigo-600/20 rounded-lg group-hover:bg-indigo-600 transition-all text-indigo-400 group-hover:text-white"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default BookCard;
