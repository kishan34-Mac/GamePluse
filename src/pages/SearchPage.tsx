import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Article } from '../types';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArticleCard } from '../components/cards/ArticleCard';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { useSearch } from '../context/SearchContext';
import { Search, Flame, Clock, X, Sparkles } from 'lucide-react';
import { BRAND } from '../config/brand';


export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { recentSearches, addRecentSearch, clearRecentSearches, removeRecentSearch } = useSearch();

  const performSearch = useCallback(async (term: string, cat: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const hits = await contentService.searchArticles(term, {
        category: cat !== 'all' ? cat : undefined,
      });
      setResults(hits);
      addRecentSearch(term);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addRecentSearch]);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (currentQ !== query) {
      setQuery(currentQ);
    }
    if (currentQ) {
      performSearch(currentQ, selectedCategory);
    } else {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedCategory, performSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term });
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'news', label: 'News' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'guides', label: 'Guides' },
    { id: 'pc-gaming', label: 'PC Gaming' },
    { id: 'mobile-gaming', label: 'Mobile Gaming' },
    { id: 'esports', label: 'Esports' },
  ];

  const breadcrumbs = [
    { label: 'SEARCH' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <SEO
        title={query ? `Search: "${query}"` : 'Search Gaming Intelligence'}
        description={`Search through GAMEPULSE articles, hardware benchmarks, game reviews, and esports guides.`}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Search Header Banner */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-purple-50/40 dark:from-slate-900 dark:via-slate-900/60 dark:to-purple-950/20 p-6 sm:p-10 shadow-sm text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Search Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Search GAMEPULSE
          </h1>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 dark:text-purple-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search news, reviews, guides, hardware..."
              className="w-full pl-12 pr-28 py-3.5 min-h-[48px] rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none shadow-md transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Popular searches row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-semibold mr-1">Trending:</span>
            {BRAND.trendingTopics.slice(0, 6).map((topic: { label: string; query: string }, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSearch(topic.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Content / Results Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton count={6} />
        </div>
      ) : query.trim() ? (
        <div>
          <div className="flex items-center justify-between mb-6 text-sm font-semibold text-slate-500">
            <span>
              Showing {results.length} result{results.length === 1 ? '' : 's'} for{' '}
              <strong className="text-slate-900 dark:text-white font-bold">"{query}"</strong>
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-purple-600 dark:text-purple-400 uppercase font-mono text-xs">
                Filter: {selectedCategory}
              </span>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(art => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No Results for "${query}"`}
              description="We couldn't find matching dispatches. Try alternate spelling, broader keywords, or reset category filters."
              actionText="Reset Search"
              onAction={() => {
                setQuery('');
                setSearchParams({});
              }}
            />
          )}
        </div>
      ) : (
        /* Empty / Initial State with Recent Searches */
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Your Search History</span>
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                  >
                    <span
                      onClick={() => handleQuickSearch(term)}
                      className="cursor-pointer"
                    >
                      {term}
                    </span>
                    <button
                      onClick={() => removeRecentSearch(term)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-center text-slate-500 dark:text-slate-400 text-sm">
            Enter a keyword above or select one of the trending topics to begin your discovery.
          </div>
        </div>
      )}
    </div>
  );
};
