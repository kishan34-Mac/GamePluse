import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';
import { Compass, Home, Gamepad2, Search } from 'lucide-react';
import { BRAND } from '../config/brand';


export const NotFoundPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-2xl mx-auto text-center space-y-8">
      <SEO
        title="404 — You've Left The Map"
        description="The gaming coordinates you requested do not exist in the GAMEPULSE world map."
      />

      {/* Cyber/Gaming Radar Icon */}
      <div className="relative w-24 h-24 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-xl pulse-glow-purple">
        <Compass className="w-12 h-12 animate-spin duration-3000" />
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold">
          404 ERR
        </span>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Out of World Bounds
        </span>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          YOU'VE LEFT THE MAP
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          The coordinates or URL you entered do not correspond to any known gaming briefing in the {BRAND.name} network. The zone may have been de-spawned or relocated.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for articles, guides, or games..."
          className="w-full pl-10 pr-24 py-3 min-h-[44px] rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Navigation CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link to="/">
          <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
            Back Home
          </Button>
        </Link>
        <Link to="/reviews">
          <Button variant="outline" size="lg" leftIcon={<Gamepad2 className="w-4 h-4" />}>
            Explore Reviews
          </Button>
        </Link>
      </div>
    </div>
  );
};
