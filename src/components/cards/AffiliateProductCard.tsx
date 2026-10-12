import React from 'react';
import { Product } from '../../types';
import { Star, ExternalLink, Check } from 'lucide-react';

export interface AffiliateProductCardProps {
  product: Product;
  className?: string;
}

export const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({
  product,
  className = '',
}) => (
  <div className={'group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 p-5 ' + className}>
    {product.badge && <div className="absolute top-3 left-3 z-10"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white shadow-md shadow-purple-600/30">{product.badge}</span></div>}
    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950/20 dark:bg-slate-950 mb-4 flex items-center justify-center p-4">
      <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="flex items-center justify-between text-xs mb-1.5">
      <span className="uppercase font-semibold tracking-wider text-purple-600 dark:text-purple-400">{product.category}</span>
      <div className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /><span>{product.rating.toFixed(1)}</span></div>
    </div>
    <h4 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2 leading-snug">{product.name}</h4>
    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
    {product.specs.length > 0 && <ul className="mb-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">{product.specs.slice(0, 3).map((spec, idx) => <li key={idx} className="flex items-center gap-1.5 truncate"><Check className="w-3 h-3 text-purple-500 shrink-0" /><span className="truncate">{spec}</span></li>)}</ul>}
    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
      <div><span className="text-[10px] text-slate-400 block uppercase">Est. Retail</span><span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">{product.pricePlaceholder}</span></div>
      {product.affiliateUrl ? <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"><span>Check Price</span><ExternalLink className="w-3.5 h-3.5" /></a> : <span className="text-[11px] text-slate-500 dark:text-slate-400 text-right">Retail link unavailable</span>}
    </div>
    <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-2">Editorial demo recommendation • Retail links are not configured</div>
  </div>
);
