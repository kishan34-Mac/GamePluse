import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AUTHORS } from '../data/authors';
import { AuthorCard } from '../components/article/AuthorCard';
import { BRAND } from '../config/brand';

import { ShieldCheck, Award, Zap, Users, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const breadcrumbs = [{ label: 'ABOUT US' }];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <SEO
        title="About Us — Editorial Mission & Standards"
        description={`Learn about the ${BRAND.name} frontend editorial-demo experience and launch requirements.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <header className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Frontend Preview</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          About {BRAND.name}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {BRAND.subheading}
        </p>
      </header>

      {/* Editorial Mission Statement */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Our Editorial Mission
        </h2>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <strong>GAMEPULSE</strong> is a frontend preview for a gaming-media experience. The bylines, stories, review scores, and product recommendations are local demonstration content, not live reporting or verified publishing records.
        </p>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          Before launch, replace or verify the demonstration content, confirm the editorial team and process, configure real contact channels, and publish substantiated standards and legal notices.
        </p>
      </section>

      {/* Pillars of Integrity */}
      <section className="space-y-6" id="standards">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Our Editorial Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">
              Independent Review Policy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Publish a verifiable conflict-of-interest and commercial-disclosure policy before presenting reviews as independent.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">
              Verifiable Testing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Publish methodology and reproducible evidence before presenting performance claims or benchmark results as tested.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">
              Corrections Process
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Establish a public corrections process before representing the site as an active editorial publication.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Masthead */}
      <section className="space-y-6" id="editorial-team">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Demonstration Byline Cards
          </h2>
        </div>

        <div className="space-y-4">
          {AUTHORS.map(author => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-center space-y-3">
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
          Need to configure launch details?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Contact delivery is not configured in this preview. Do not submit sensitive information until a verified endpoint is available.
        </p>
        <Link
          to="/contact"
          className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
        >
          View Contact Status &rarr;
        </Link>
      </div>
    </div>
  );
};
