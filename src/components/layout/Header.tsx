import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg shadow-black/5 dark:shadow-purple-950/10 py-2.5'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg group"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 group-hover:bg-purple-400 transition-colors animate-pulse shadow-md shadow-purple-500/50" />
              <span className="absolute w-5 h-5 rounded-full bg-purple-500/20 animate-ping pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-none">
                {BRAND.name}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mt-0.5 hidden sm:block">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {BRAND.navigation.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.href}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl font-display font-bold text-xs tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'text-white bg-purple-600 shadow-md shadow-purple-600/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons: Search & Theme Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button with '/' indicator */}
            <button
              onClick={openSearch}
              aria-label="Open search modal (Press / to search)"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/50 transition-all text-xs cursor-pointer shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline font-medium">Search...</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                /
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/50 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open navigation menu"
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
