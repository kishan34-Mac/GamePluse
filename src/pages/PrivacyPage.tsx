import React from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BRAND } from '../config/brand';

import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const breadcrumbs = [{ label: 'PRIVACY POLICY' }];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SEO
        title="Privacy Policy — Data Protection & Cookies"
        description={`Learn how ${BRAND.name} collects, protects, and manages user information, cookies, and analytics.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Document</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2025 • Last Updated: October 2025</p>
      </header>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Overview & Scope
          </h2>
          <p>
            At <strong>{BRAND.name}</strong> ({BRAND.url}), accessible from our web domains and mobile web interfaces, the privacy of our visitors is of paramount importance. This Privacy Policy outlines the types of information recorded and collected by {BRAND.name} and how we utilize it in accordance with applicable data protection frameworks including GDPR and CCPA.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            We do not require account registration to read our editorial content. We may collect information voluntarily submitted when you:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Subscribe to the GAMEPULSE newsletter ("LEVEL UP YOUR INBOX").</li>
            <li>Submit comments, feedback, or editorial tips via our Contact desk.</li>
            <li>Participate in community polls, survey inquiries, or editorial contests.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            3. Cookies, Telemetry & Web Beacons
          </h2>
          <p>
            Like any modern digital media publication, {BRAND.name} uses standard browser cookies to remember display preferences (such as your dark or light theme selection) and aggregate anonymous reading analytics. These telemetry metrics assist our editors in understanding which game guides and hardware analyses resonate with our community.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            4. Third-Party Advertising & Partner Networks
          </h2>
          <p>
            Our web platform may display programmatic advertising placements managed by reputable ad networks (including Google AdSense and certified digital partners). These third-party vendors may utilize cookies and web beacons to serve contextually relevant advertisements based on aggregated browsing habits. Users may opt out of personalized advertising by visiting Google Ad Settings or the Digital Advertising Alliance consumer opt-out portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            5. Your Data Rights & Contact Information
          </h2>
          <p>
            You have the right to request access to, amendment of, or deletion of any personal data held by {BRAND.name}. To exercise your data rights or make inquiries, please contact our privacy compliance desk at <a href={`mailto:${BRAND.contactEmail}`} className="text-purple-600 dark:text-purple-400 underline">{BRAND.contactEmail}</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
