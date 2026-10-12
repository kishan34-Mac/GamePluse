import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { BRAND } from '../config/brand';

import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject line is required.';
    if (!formData.message.trim()) {
      errs.message = 'Message content cannot be blank.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters long.';
    }
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrors({});

    // Simulate realistic network latency
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const breadcrumbs = [{ label: 'CONTACT' }];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <SEO
        title="Contact Us — Newsroom & Press Inquiries"
        description={`Get in touch with the ${BRAND.name} editorial staff, report a breaking news tip, or submit game review codes.`}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Connect With {BRAND.name}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Whether you are a developer with an embargoed build, a reader with feedback, or a commercial partner, our newsroom is listening.
        </p>
      </header>

      {/* Contact Grid: Form + Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="md:col-span-7 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Transmission Received
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting GAMEPULSE. Our editorial desk has logged your inquiry and will respond within 24 to 48 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold underline hover:opacity-80 pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Subject / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Editorial Tip, Review Request, or Advertising"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                {errors.subject && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide context, details, and relevant links..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-y"
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={status === 'loading'}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Direct Inboxes</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-semibold block">Editorial & News Desk</span>
                <a
                  href={`mailto:${BRAND.editorialEmail}`}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {BRAND.editorialEmail}
                </a>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-semibold block">Review Codes & Embargoes</span>
                <a
                  href={`mailto:${BRAND.contactEmail}`}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {BRAND.contactEmail}
                </a>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-semibold block">Advertising & Sponsorship</span>
                <a
                  href={`mailto:${BRAND.advertisingEmail}`}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {BRAND.advertisingEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-3">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span>Confidential Tips</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We respect source anonymity and protect whistleblower identities. For sensitive studio leaks, please specify in the subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
