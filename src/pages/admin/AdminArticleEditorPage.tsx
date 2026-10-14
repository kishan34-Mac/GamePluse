import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/apiClient';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/common/Button';
import { Category, Author, Game } from '../../types';

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [category, setCategory] = useState('news');
  const [tagsInput, setTagsInput] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [image, setImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [popular, setPopular] = useState(false);
  const [editorsPick, setEditorsPick] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [gameId, setGameId] = useState('');

  // Taxonomies
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isEditing && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Load taxonomies & article data
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, auths, gms] = await Promise.all([
          api.get<Category[]>('/categories'),
          api.get<Author[]>('/authors'),
          api.get<Game[]>('/games'),
        ]);
        setCategories(cats);
        setAuthors(auths);
        setGames(gms);
        if (auths.length > 0 && !authorId) {
          setAuthorId(auths[0].id || auths[0].name);
        }

        if (isEditing && id) {
          const article: any = await api.get(`/admin/articles/${id}`);
          setTitle(article.title || '');
          setSlug(article.slug || '');
          setSubtitle(article.subtitle || '');
          setExcerpt(article.excerpt || '');
          setRawContent(
            article.rawContent ||
              (article.contentBlocks || []).map((b: any) => b.text).filter(Boolean).join('\n\n') ||
              ''
          );
          setCategory(article.category || 'news');
          setTagsInput((article.tags || []).join(', '));
          setAuthorId(article.authorId || '');
          setImage(article.image || '');
          setImageCaption(article.imageCaption || '');
          setReadingTime(article.readingTime || '');
          setFeatured(Boolean(article.featured));
          setTrending(Boolean(article.trending));
          setPopular(Boolean(article.popular));
          setEditorsPick(Boolean(article.editorsPick));
          setStatus(article.status || 'draft');
          setSeoTitle(article.seoTitle || '');
          setSeoDescription(article.seoDescription || '');
          setCanonicalUrl(article.canonicalUrl || '');
          setGameId(article.gameId || '');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load article editor data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !image.trim()) {
      setError('Title, excerpt, and featured image are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // If reading time is empty, calculate from word count
    let calculatedReadingTime = readingTime.trim();
    if (!calculatedReadingTime) {
      const words = [title, excerpt, rawContent].join(' ').split(/\s+/).filter(Boolean).length;
      calculatedReadingTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    }

    const payload: any = {
      title: title.trim(),
      slug: slug.trim(),
      subtitle: subtitle.trim() || undefined,
      excerpt: excerpt.trim(),
      rawContent,
      category,
      tags,
      authorId: authorId || admin?.id,
      image: image.trim(),
      imageCaption: imageCaption.trim() || undefined,
      readingTime: calculatedReadingTime,
      featured,
      trending,
      popular,
      editorsPick,
      status,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      gameId: gameId.trim() || undefined,
    };

    try {
      if (isEditing && id) {
        await api.patch(`/admin/articles/${id}`, payload);
        setSuccessMessage('Article saved successfully!');
      } else {
        const created: any = await api.post('/admin/articles', payload);
        setSuccessMessage('Article created successfully!');
        setIsDirty(false);
        navigate(`/admin/articles/${created.id || created._id}/edit`, { replace: true });
      }
      setIsDirty(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft, compose, and format stories with structured metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              previewMode
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Exit Preview' : 'Preview Layout'}</span>
          </button>

          <Button
            onClick={handleSubmit}
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Article
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Live Preview Mode */}
      {previewMode ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-tight">
              {title || 'Untitled Article'}
            </h1>
            {subtitle && <p className="text-lg text-slate-300 leading-relaxed">{subtitle}</p>}
            <p className="text-sm text-slate-400 italic border-l-2 border-purple-500 pl-3">
              {excerpt}
            </p>
            {image && (
              <figure className="my-6">
                <img src={image} alt={title} className="w-full h-80 object-cover rounded-2xl" />
                {imageCaption && (
                  <figcaption className="text-xs text-slate-400 mt-2 text-center">
                    {imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-6">
              {rawContent || 'No article body text written yet.'}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form Grid */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title & Slug */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. GTA 6 Vice City Map & Leaks Deep Dive"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-white font-semibold text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="gta-6-vice-city-map-deep-dive"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-300 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Engaging secondary header..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Excerpt / Lead Paragraph *
                </label>
                <textarea
                  rows={3}
                  required
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Summary shown on article cards and search results..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-300 text-xs outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Body Content Editor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Story Content (Markdown / HTML Sanitized)
                </label>
                <span className="text-[11px] text-slate-500">
                  {rawContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={16}
                value={rawContent}
                onChange={(e) => {
                  setRawContent(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Write your article narrative here. Supports paragraphs, headings, blockquotes, and links..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 text-sm font-mono leading-relaxed outline-none"
              />
            </div>

            {/* SEO Metadata Editor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search Engine Optimization (SEO)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => {
                      setSeoTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Custom meta title (optional)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => {
                      setCanonicalUrl(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://gamepulse.io/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Meta description for search engine snippets..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings Column */}
          <div className="space-y-5">
            {/* Publication Status Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Publication Workflow
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="draft">Draft (Private)</option>
                  {admin?.role !== 'author' && <option value="published">Published</option>}
                  {admin?.role !== 'author' && <option value="archived">Archived</option>}
                </select>
                {admin?.role === 'author' && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Authors can only save drafts. An Editor or Super Admin will review and publish.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
                <select
                  value={authorId}
                  disabled={admin?.role === 'author'}
                  onChange={(e) => {
                    setAuthorId(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="GTA 6, Rockstar, PS5, Vice City"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Associated Game Hub</label>
                <select
                  value={gameId}
                  onChange={(e) => {
                    setGameId(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="">None (Independent article)</option>
                  {games.map((g) => (
                    <option key={g.id || g.slug} value={g.slug || g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Featured Media *
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Image Caption</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => {
                    setImageCaption(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Photo credit / description"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              {image && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-36">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Editorial Features Flags */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Editorial Placement
              </h3>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Hero / Featured Lead Article</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => {
                    setTrending(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Trending Ticker Inclusion</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => {
                    setPopular(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Popular / High Velocity Feed</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editorsPick}
                  onChange={(e) => {
                    setEditorsPick(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <span>Editor's Pick Highlight</span>
              </label>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
