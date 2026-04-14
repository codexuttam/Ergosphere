import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Compass, Search, Sparkles, Filter } from 'lucide-react';
import BookCard from './components/BookCard';
import ChatBox from './components/ChatBox';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/books/');
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
        // Fallback mock data
        setBooks([
          { id: 1, title: "A Light in the Attic", author: "Shel Silverstein", description: "It's back! The much-loved A Light in the Attic.", rating: "Five", url: "#", price: "£51.77" },
          { id: 2, title: "Tipping the Velvet", author: "Sarah Waters", description: "Nan King, an oyster girl, is captivated.", rating: "One", url: "#", price: "£53.74" },
        ]);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-screen p-8 lg:p-12 max-w-[1600px] mx-auto bg-[#0a0a0c]">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Book className="text-white w-6 h-6" />
            </div>
            <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase">Ergosphere Intelligence</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black gradient-text leading-tight"
          >
            Document <br /> Intelligence
          </motion.h1>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search metadata..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-indigo-500 transition-all w-64 lg:w-80"
             />
           </div>
           <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-slate-600 transition-all">
             <Filter className="w-6 h-6" />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <Compass className="text-indigo-500 w-6 h-6" />
               <h2 className="text-2xl font-bold text-white">Discovery Feed</h2>
             </div>
             <span className="text-slate-500 text-sm">{filteredBooks.length} items cataloged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          {filteredBooks.length === 0 && (
            <div className="glass-morphism rounded-3xl p-12 text-center text-slate-500 font-medium">
              Initializing intelligence feed...
            </div>
          )}
        </section>

        <aside className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3 text-indigo-400 uppercase tracking-widest text-xs font-black">
            <Sparkles className="w-4 h-4" />
            <span>AI Augmented Insights</span>
          </div>
          <ChatBox />
        </aside>
      </div>
    </main>
  );
}

export default App;
