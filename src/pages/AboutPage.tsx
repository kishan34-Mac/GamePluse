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
        description={`Learn about ${BRAND.name}, our editorial standards, masthead team, and mission to deliver fearless gaming journalism.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <header className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5" />
          <span>The Publication</span>
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
          Founded on the principle of unflinching editorial integrity, <strong>GAMEPULSE</strong> serves millions of interactive entertainment enthusiasts worldwide. We reject sensationalist clickbait and commercial compromise, focusing instead on exhaustive investigative reporting, forensic hardware benchmarking, and nuanced cultural critique.
        </p>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          Whether we are evaluating a generational hardware launch like the NVIDIA Blackwell architecture, analyzing global tournament metas in the Valorant Champions Tour, or delivering a definitive 50-hour review score, our goal is singular: to be the most dependable compass in modern video gaming.
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
              Zero Commercial Interference
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our review scores and hardware recommendations are never for sale. Advertising and commercial departments operate behind an impenetrable firewall.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">
              Rigorous Lab Benchmarking
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hardware tests are conducted using standardized test benches, repeatable telemetry runs, and minimum 1% low frame time tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">
              Accountability & Transparency
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When games receive post-launch patches that alter performance, we update reviews and publish transparent changelogs.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Masthead */}
      <section className="space-y-6" id="editorial-team">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Editorial Masthead
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
          Have an editorial tip or press inquiry?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Our investigative newsroom operates confidential communication channels for developers, whistleblowers, and studio insiders.
        </p>
        <Link
          to="/contact"
          className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
        >
          Contact the Newsroom &rarr;
        </Link>
      </div>
    </div>
  );
};
