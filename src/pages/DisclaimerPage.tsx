import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BRAND } from '../config/brand';

import { Scale, ShoppingCart } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  const breadcrumbs = [{ label: 'EDITORIAL DISCLAIMER & ETHICS' }];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SEO
        title="Editorial Disclaimer & Scoring Methodology"
        description={`Read the ${BRAND.name} editorial-content and monetization status notice.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Ethics & Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Editorial Disclaimer & Review Policy
        </h1>
        <p className="text-xs text-slate-500">Frontend preview notice • Review and replace before production launch</p>
      </header>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {/* Section 1: Independence */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Strict Editorial Independence
          </h2>
          <p>
            This frontend uses local demonstration content to present the editorial experience. It does not represent a live newsroom, independently verified reporting, or a record of commercial relationships.
          </p>
          <p>
            Before launch, publish an editorial policy only after its claims, review process, and disclosures can be substantiated.
          </p>
        </section>

        {/* Section 2: Review Scoring Scale */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. The GAMEPULSE 10-Point Scoring Scale
          </h2>
          <p>
            We evaluate video games on a 1.0 to 10.0 scale in increments of 0.1, judged across five core technical and artistic categories: <em>Gameplay Mechanics, Graphics & Art Direction, Performance Stability, Sound Design, and Replayability</em>.
          </p>

          <div className="space-y-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold font-mono text-emerald-500">9.5 — 10.0</span>
              <span className="font-bold text-slate-900 dark:text-white">Masterpiece: An essential, genre-defining technical or artistic zenith.</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold font-mono text-emerald-400">9.0 — 9.4</span>
              <span className="font-bold text-slate-900 dark:text-white">Exceptional: Outstanding craft with only negligible minor flaws.</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold font-mono text-purple-400">8.0 — 8.9</span>
              <span className="font-bold text-slate-900 dark:text-white">Great: Highly enjoyable experience well worth your time and money.</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold font-mono text-amber-400">7.0 — 7.9</span>
              <span className="font-bold text-slate-900 dark:text-white">Good: Solid entertainment with noticeable mechanics or performance compromises.</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-bold font-mono text-rose-400">&lt; 7.0</span>
              <span className="font-bold text-slate-900 dark:text-white">Mediocre / Flawed: Stifled by critical technical bugs or uninspired game design.</span>
            </div>
          </div>
        </section>

        {/* Section 3: Affiliate Disclosure */}
        <section className="space-y-3" id="affiliate">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              3. Affiliate and Commerce Status
            </h2>
          </div>
          <p>
            No affiliate partners, retailer links, sponsored product placements, or purchase tracking are configured in this build.
          </p>
          <p>
            If affiliate links are added later, disclose each commercial relationship clearly and ensure that prices, availability, and claims are verified at publication time.
          </p>
        </section>

        {/* Section 4: Sponsored Content */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            4. Sponsored Content Standards
          </h2>
          <p>
            No sponsored content or advertisements are configured in this build. Any future paid placement must be visibly labeled and backed by a real disclosure policy before release.
          </p>
        </section>
      </div>
    </div>
  );
};
