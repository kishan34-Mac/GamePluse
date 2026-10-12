import React from 'react';
import { Quote, AlertCircle, Info, Play, Check, X, HelpCircle } from 'lucide-react';
import { FAQItem } from '../../types';

export const ArticleParagraph: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 my-5 font-normal ${className}`}>
      {children}
    </p>
  );
};

export const ArticleHeading: React.FC<{
  level: 2 | 3 | 4;
  id?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ level, id, children, className = '' }) => {
  const commonClasses = 'font-display font-bold text-slate-900 dark:text-white tracking-tight scroll-mt-24';
  if (level === 2) {
    return (
      <h2 id={id} className={`text-2xl sm:text-3xl mt-12 mb-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 ${commonClasses} ${className}`}>
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 id={id} className={`text-xl sm:text-2xl mt-8 mb-4 ${commonClasses} ${className}`}>
        {children}
      </h3>
    );
  }
  return (
    <h4 id={id} className={`text-lg sm:text-xl mt-6 mb-3 ${commonClasses} ${className}`}>
      {children}
    </h4>
  );
};

export const ArticleImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}> = ({ src, alt, caption, className = '' }) => {
  return (
    <figure className={`my-8 sm:my-10 ${className}`}>
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
        <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
      </div>
      {caption && (
        <figcaption className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const ArticleQuote: React.FC<{
  text: string;
  author?: string;
  role?: string;
  className?: string;
}> = ({ text, author, role, className = '' }) => {
  return (
    <blockquote
      className={`my-8 p-6 sm:p-8 rounded-2xl border-l-4 border-purple-600 bg-purple-500/5 dark:bg-purple-950/20 backdrop-blur-sm relative overflow-hidden ${className}`}
    >
      <Quote className="absolute right-4 bottom-4 w-16 h-16 text-purple-600/10 pointer-events-none" />
      <p className="text-lg sm:text-xl font-display italic text-slate-800 dark:text-slate-100 leading-snug mb-3">
        “{text}”
      </p>
      {author && (
        <div className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
          — {author}
          {role && <span className="text-slate-500 font-normal">, {role}</span>}
        </div>
      )}
    </blockquote>
  );
};

export const ArticleHighlight: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  return (
    <div
      className={`my-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 font-medium text-sm sm:text-base leading-relaxed ${className}`}
    >
      {text}
    </div>
  );
};

export const ArticleInfoBox: React.FC<{
  title?: string;
  text: string;
  className?: string;
}> = ({ title = 'Key Intelligence', text, className = '' }) => {
  return (
    <div
      className={`my-6 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-950/20 text-slate-800 dark:text-slate-200 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm sm:text-base font-bold font-display text-cyan-600 dark:text-cyan-400 mb-2">
        <Info className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
        {text}
      </div>
    </div>
  );
};

export const ArticleWarningBox: React.FC<{
  title?: string;
  text: string;
  className?: string;
}> = ({ title = 'Cautionary Notice', text, className = '' }) => {
  return (
    <div
      className={`my-6 p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm sm:text-base font-bold font-display text-amber-600 dark:text-amber-400 mb-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
        {text}
      </div>
    </div>
  );
};

export const ArticleProsCons: React.FC<{
  pros: string[];
  cons: string[];
  className?: string;
}> = ({ pros, cons, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 my-6 ${className}`}>
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
        <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> Pros
        </h5>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20">
        <h5 className="font-bold text-xs uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" /> Cons
        </h5>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const ArticleVideoPlaceholder: React.FC<{
  title?: string;
  caption?: string;
  className?: string;
}> = ({ title = 'Featured Gameplay Reel', caption, className = '' }) => {
  return (
    <div className={`my-8 ${className}`}>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group cursor-pointer shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500" />
        <div className="relative z-10 w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-2xl group-hover:bg-purple-500 group-hover:scale-110 transition-all">
          <Play className="w-6 h-6 ml-0.5" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white bg-slate-950/70 p-2.5 rounded-lg backdrop-blur-md">
          {title}
        </div>
      </div>
      {caption && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
          {caption}
        </p>
      )}
    </div>
  );
};

export const ArticleFAQ: React.FC<{ faqs: FAQItem[]; className?: string }> = ({
  faqs,
  className = '',
}) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`my-10 pt-8 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <span>Frequently Asked Questions</span>
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
          >
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              {faq.question}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
