import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, ExternalLink } from 'lucide-react';
import { XIcon, FacebookIcon } from '../common/SocialIcons';

interface ArticleShareProps {
  title: string;
  url?: string;
  className?: string;
}

export const ArticleShare: React.FC<ArticleShareProps> = ({ title, url, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    let copiedSuccessfully = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copiedSuccessfully = true;
      }
    } catch {
      copiedSuccessfully = false;
    }

    if (!copiedSuccessfully) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      copiedSuccessfully = document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (copiedSuccessfully) {
      setCopied(true);
      setCopyMessage('Article link copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyMessage('Unable to copy the article link.');
    }
  };

  const platforms = [
    {
      name: 'X (Twitter)',
      icon: <XIcon className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-slate-900 hover:text-white',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-emerald-600 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'Reddit',
      icon: <ExternalLink className="w-4 h-4" />,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-600 hover:text-white',
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="sr-only" aria-live="polite">{copyMessage}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </span>

      {platforms.map((platform, idx) => (
        <a
          key={idx}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all ${platform.color} shadow-sm`}
        >
          {platform.icon}
        </a>
      ))}

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy article link"
        className="relative inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-xs font-semibold transition-all shadow-sm cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
