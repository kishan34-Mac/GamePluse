import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

export const NewsletterCTA: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'typing' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage('');
    if (state !== 'typing' && state !== 'loading') {
      setState('typing');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setState('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setState('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setState('loading');
    setErrorMessage('');

    // Local-only acknowledgement: no email is sent by this frontend.
    setTimeout(() => {
      setState('success');
      setEmail('');
    }, 900);
  };

  return (
    <section className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 p-6 sm:p-10 lg:p-14 text-white shadow-2xl pulse-glow-purple ${className}`}>
      {/* Decorative ambient elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Briefing</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display mb-3 sm:mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          LEVEL UP YOUR INBOX
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto">
          Get ready for future GAMEPULSE newsletters. This preview validates your email locally and does not send or store it.
        </p>

        {state === 'success' ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-purple-900/30 border border-purple-500/40 animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">You're on the VIP list!</h3>
            <p className="text-xs text-slate-300 text-center max-w-xs">
              Your email passed local validation. Newsletter delivery is not configured in this preview.
            </p>
            <button
              onClick={() => setState('idle')}
              className="mt-4 text-xs text-purple-300 underline hover:text-white"
            >
              Sign up another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                aria-label="Email Address"
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-slate-950/80 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-400 text-sm outline-none transition-all"
                disabled={state === 'loading'}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={state === 'loading'}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shrink-0"
            >
              Subscribe
            </Button>
          </form>
        )}

        {state === 'error' && errorMessage && (
          <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs mt-3 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-4">
          By subscribing, you agree to our{' '}
          <a href="/privacy-policy" className="underline hover:text-slate-200">
            Privacy Policy
          </a>{' '}
          and consent to receive updates.
        </p>
      </div>
    </section>
  );
};
