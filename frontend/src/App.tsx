import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Compass, Search, Sparkles, Filter } from 'lucide-react';
import BookCard from './components/BookCard';
import ChatBox from './components/ChatBox';
import BookDetail from './components/BookDetail';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Mesh Background Decorations */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mesh-ball top-[-10%] left-[-5%] opacity-20" 
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 50, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="mesh-ball bottom-[-10%] right-[-5%] bg-rose-500 opacity-10" 
      />

      <main className="relative z-10 p-8 lg:p-12 max-w-[1600px] mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Book className="text-white w-6 h-6" />
              </div>
              <span className="text-indigo-400 font-extrabold tracking-[0.2em] text-xs uppercase">Ergosphere Intelligence</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-8xl font-black gradient-text leading-[0.9] tracking-tight"
            >
              Document <br /> <span className="text-indigo-400">Intelligence</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4 p-2 glass-morphism rounded-3xl"
          >
             <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Search catalog metadata..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="bg-slate-900/40 border-none rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-64 lg:w-96 placeholder:text-slate-600"
               />
             </div>
             <button className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all">
               <Filter className="w-6 h-6" />
             </button>
          </motion.div>
        </header>

        <div className="flex flex-col gap-16">
          {/* Q&A Section (Feature) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 uppercase tracking-[0.3em] text-[10px] font-black bg-indigo-500/5 w-fit px-4 py-2 rounded-full border border-indigo-500/10 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Intelligent Q&A Pipeline</span>
            </div>
            <ChatBox />
          </section>

          {/* Catalog Section */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Compass className="text-indigo-500 w-6 h-6" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-white tracking-tight">Discovery Feed</h2>
               </div>
               <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                 {filteredBooks.length} items cataloged
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book, idx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <BookCard book={book} onClick={setSelectedBook} />
                </motion.div>
              ))}
            </div>
            
            {filteredBooks.length === 0 && (
              <div className="glass-morphism rounded-[40px] p-24 text-center">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Search className="text-indigo-500 w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-lg leading-relaxed">
                  Initializing alternative nodes or try a different keyword.
                </p>
              </div>
            )}
          </section>
        </div>
        
        {/* Book Detail Overlay */}
        <AnimatePresence>
          {selectedBook && (
            <BookDetail 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
