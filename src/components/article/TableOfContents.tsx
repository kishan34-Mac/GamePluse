import React, { useState, useEffect } from 'react';
import { TableOfContentItem } from '../../types';
import { ListOrdered, ChevronDown, ChevronUp } from 'lucide-react';

interface TableOfContentsProps {
  items: TableOfContentItem[];
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items, className = '' }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <nav
      aria-label="Table of contents"
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-5 ${className}`}
    >
      {/* Mobile Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpenMobile(prev => !prev)}
        className="w-full flex items-center justify-between text-left lg:pointer-events-none"
        aria-expanded={isOpenMobile}
      >
        <div className="flex items-center gap-2 text-sm font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white">
          <ListOrdered className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Table of Contents</span>
        </div>
        <span className="lg:hidden text-slate-500">
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* List items (always visible on desktop, toggleable on mobile) */}
      <div className={`mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 lg:block ${isOpenMobile ? 'block' : 'hidden lg:block'}`}>
        <ul className="space-y-1.5 text-xs sm:text-sm">
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={`${item.level === 3 ? 'pl-3' : 'pl-0'}`}
              >
                <a
                  href={`#${item.id}`}
                  onClick={e => handleLinkClick(e, item.id)}
                  className={`block py-1 px-2 rounded-lg transition-colors leading-snug ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
