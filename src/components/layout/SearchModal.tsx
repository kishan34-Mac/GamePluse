import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Flame, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { contentService } from '../../services/contentService';
import { Article } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { getArticlePath } from '../../utils/contentPaths';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useSearch();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Lock body scroll when search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Live search effect with debounce
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const hits = await contentService.searchArticles(query, {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        });
        setResults(hits);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, selectedCategory]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (article: Article) => {
    addRecentSearch(query.trim() || article.title);
    closeSearch();
    navigate(getArticlePath(article));
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      addRecentSearch(query.trim());
      closeSearch();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href]'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'news', label: 'News' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'guides', label: 'Guides' },
    { id: 'pc-gaming', label: 'PC Gaming' },
    { id: 'mobile-gaming', label: 'Mobile' },
    { id: 'esports', label: 'Esports' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles and games"
      ref={dialogRef}
      onKeyDown={handleDialogKeyDown}
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="relative flex items-center p-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              const val = e.target.value;
              setQuery(val);
              if (!val.trim()) {
                setResults([]);
                setIsSearching(false);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search news, reviews, guides, PC hardware..."
            className="w-full pl-3 pr-10 py-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base font-medium outline-none"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results / Suggestions Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Live Search Results */}
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                <span>Search Results ({results.length})</span>
                {isSearching && <span className="text-purple-400">Searching...</span>}
              </div>

              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map(article => (
                    <button
                      type="button"
                      key={article.id}
                      onClick={() => handleSelectResult(article)}
                      className="group w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                          <span className="text-purple-600 dark:text-purple-400">
                            {article.category.replace('-', ' ')}
                          </span>
                          <span>•</span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                          {article.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {article.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      addRecentSearch(query.trim());
                      closeSearch();
                      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>View all matching results for "{query}"</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No articles found matching "{query}". Try checking another category or broader keywords.
                </div>
              )}
            </div>
          ) : (
            /* Default: Recent Searches & Trending */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-purple-100 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-300 transition-colors group"
                      >
                        <button
                          type="button"
                          onClick={() => handleQuickSearch(term)}
                          className="px-3 py-1.5"
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            removeRecentSearch(term);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                          aria-label={`Remove ${term}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['GTA 6', 'Elden Ring Erdtree', 'Black Myth Wukong', 'RTX 5090', 'Valorant VCT', 'Helldivers 2'].map(
                    (pop, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickSearch(pop)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 text-slate-700 dark:text-slate-300 text-xs font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
                      >
                        {pop}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
