import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BRAND } from '../config/brand';

import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const breadcrumbs = [{ label: 'TERMS OF SERVICE' }];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SEO
        title="Terms of Service — Platform Usage & Licensing"
        description={`Read the Terms of Service governing your access and usage of ${BRAND.name} media and content.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2025 • Last Updated: October 2025</p>
      </header>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or browsing <strong>{BRAND.name}</strong> ({BRAND.url}), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this publication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. Intellectual Property & Editorial Copyright
          </h2>
          <p>
            All original editorial written dispatches, benchmark test data, graphical diagrams, custom illustrations, and video recordings published on {BRAND.name} are the intellectual property of {BRAND.name} Media Network, protected by international copyright laws.
          </p>
          <p>
            Video game trademarks, studio logos, character likenesses, and box art displayed on {BRAND.name} are the property of their respective publishers and developers and are utilized strictly under nominative fair use doctrine for journalistic commentary and review analysis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            3. User Conduct & Acceptable Usage
          </h2>
          <p>
            You agree not to use automated scraping software, headless browsers, or programmatic ingestion tools to extract editorial articles, benchmarking telemetry, or review databases without express written authorization from {BRAND.name}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            {BRAND.name} provides gaming information, hardware recommendations, and settings guides on an "as is" basis. While our technical team conducts rigorous lab benchmarking, hardware modifications (e.g. BIOS flashing, custom cooling, or overclocking) are executed at the reader's own discretion and risk.
          </p>
        </section>
      </div>
    </div>
  );
};
