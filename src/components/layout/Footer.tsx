import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { XIcon, YouTubeIcon, InstagramIcon, FacebookIcon, RedditIcon } from '../common/SocialIcons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Twitter':
        return <XIcon className="w-4 h-4" />;
      case 'Youtube':
        return <YouTubeIcon className="w-4 h-4" />;
      case 'Instagram':
        return <InstagramIcon className="w-4 h-4" />;
      case 'Facebook':
        return <FacebookIcon className="w-4 h-4" />;
      case 'Reddit':
        return <RedditIcon className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };


  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-sm shadow-purple-500" />
              <span className="font-display font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              {BRAND.tagline}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {BRAND.subheading}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {BRAND.socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all shadow-sm"
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: EXPLORE */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {BRAND.footerSections.explore.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: COMPANY */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {BRAND.footerSections.company.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: LEGAL */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {BRAND.footerSections.legal.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>
            &copy; {BRAND.currentYear} {BRAND.name} frontend preview. Local demonstration content requires verification before publication.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
