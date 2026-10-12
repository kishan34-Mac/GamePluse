import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Search, Sun, Moon, ChevronRight } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearch();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Esc key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'Tab' && isOpen) {
        const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={menuRef}
        id="mobile-navigation-menu"
        className="w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-sm shadow-purple-500" />
              <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                {BRAND.name}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close Navigation Menu"
              className="p-2 min-w-[44px] min-h-[44px] rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Button in Menu */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => {
                onClose();
                openSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                <span>Search articles, guides, reviews...</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Mobile Navigation" className="p-4 space-y-1">
            {BRAND.navigation.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400'
                  }`
                }
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom actions & Theme Toggle */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Appearance</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-500 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-display">
              {BRAND.tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
