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
        <p className="text-xs text-slate-500">Frontend preview notice • Review and replace before production launch</p>
      </header>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Overview & Scope
          </h2>
          <p>
            This frontend preview stores only browser-local preferences needed for the interface. It is not a complete production privacy policy and must be reviewed against the services enabled at launch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            This build does not require account registration. Newsletter and contact forms validate input locally and do not send or store submissions.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The selected color theme is stored in the browser using local storage.</li>
            <li>Recent search terms are stored in the browser using local storage.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            3. Cookies, Telemetry & Web Beacons
          </h2>
          <p>
            This frontend does not include analytics, advertising, tracking pixels, or a cookie-consent integration. Theme and recent-search preferences are stored locally by the browser and can be cleared through browser site-data controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            4. Third-Party Services
          </h2>
          <p>
            The current frontend displays no advertising or affiliate integrations. It loads editorial imagery from Unsplash. A production privacy policy must disclose any future analytics, advertising, newsletter, contact, or other third-party service before those services are enabled.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            5. Your Data Rights & Contact Information
          </h2>
          <p>
            There is no data-rights contact endpoint configured in this preview because it does not collect submissions. Before launch, provide a verified privacy contact address and a legally reviewed policy that reflects the deployed services.
          </p>
        </section>
      </div>
    </div>
  );
};
