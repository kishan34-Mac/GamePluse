import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Article, Author } from '../types';
import { SEO } from '../components/common/SEO';
import { ArticleHeader } from '../components/article/ArticleHeader';
import { ArticleBody } from '../components/article/ArticleBody';
import { ArticleProgress } from '../components/article/ArticleProgress';
import { TableOfContents } from '../components/article/TableOfContents';
import { ArticleShare } from '../components/article/ArticleShare';
import { AuthorCard } from '../components/article/AuthorCard';
import { ArticleCard } from '../components/cards/ArticleCard';
import { NewsletterCTA } from '../components/common/NewsletterCTA';
import { AdSlot } from '../components/common/AdSlot';
import { ArticleSkeleton } from '../components/common/LoadingSkeleton';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { BRAND } from '../config/brand';
import { NotFoundPage } from './NotFoundPage';


export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [prevArticle, setPrevArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!slug) return;
      setIsLoading(true);

      try {
        const found = await contentService.getArticleBySlug(slug);
        const routeCategory = pathname.split('/')[1];
        if (found && found.category === routeCategory) {
          setArticle(found);

          const [auth, related, all] = await Promise.all([
            contentService.getAuthorById(found.authorId),
            contentService.getRelatedArticles(found.id, found.category, found.tags, 3),
            contentService.getArticles(),
          ]);

          setAuthor(auth || null);
          setRelatedArticles(related);

          // Calculate Previous & Next articles
          const currentIndex = all.findIndex(a => a.id === found.id);
          if (currentIndex > 0) {
            setPrevArticle(all[currentIndex - 1]);
          } else {
            setPrevArticle(null);
          }
          if (currentIndex < all.length - 1) {
            setNextArticle(all[currentIndex + 1]);
          } else {
            setNextArticle(null);
          }
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, pathname]);

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (!article) return <NotFoundPage />;

  return (
    <article className="relative space-y-12 max-w-7xl mx-auto">
      {/* Top Reading Progress Bar */}
      <ArticleProgress />

      {/* SEO Metadata and Structured Data */}
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        ogImage={article.image}
        ogType="article"
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        authorName={author ? author.name : BRAND.author}
        canonicalUrl={`${BRAND.url}/${article.category}/${article.slug}`}
        schemaType="Article"
        faqs={article.faqs}
        breadcrumbs={[
          { name: 'Home', url: BRAND.url },
          { name: article.category.toUpperCase(), url: `${BRAND.url}/${article.category}` },
          { name: article.title, url: `${BRAND.url}/${article.category}/${article.slug}` },
        ]}
      />

      {/* Header Section */}
      <ArticleHeader article={article} author={author || undefined} />

      {/* Main Reading Grid: Content + Desktop Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Article Reading Column */}
        <div className="lg:col-span-8 min-w-0">
          {/* Mobile Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="lg:hidden mb-8">
              <TableOfContents items={article.tableOfContents} />
            </div>
          )}

          {/* Article Body */}
          <ArticleBody article={article} />

          {/* Mid-Article Monetization Placement */}
          <AdSlot variant="inArticle" slotId="article-body-mid" />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 pb-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Filed Under:
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Share Bar */}
          <div className="py-6 border-y border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Enjoyed this briefing? Share with your squad:
            </span>
            <ArticleShare title={article.title} />
          </div>

          {/* Author Bio Card */}
          {author && (
            <div className="pt-8">
              <AuthorCard author={author} />
            </div>
          )}

          {/* Previous / Next Article Navigation */}
          <nav aria-label="Previous and Next Articles" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
            {prevArticle ? (
              <Link
                to={`/${prevArticle.category}/${prevArticle.slug}`}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-purple-500 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Story</span>
                </div>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
                  {prevArticle.title}
                </h4>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle && (
              <Link
                to={`/${nextArticle.category}/${nextArticle.slug}`}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-purple-500 transition-all flex flex-col justify-between text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Next Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
                  {nextArticle.title}
                </h4>
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          {/* Desktop Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="hidden lg:block">
              <TableOfContents items={article.tableOfContents} />
            </div>
          )}

          {/* Sidebar Monetization AdSlot */}
          <AdSlot variant="sidebar" slotId="article-sidebar" />

          {/* Quick Newsletter Mini Promo */}
          <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-center">
            <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h4 className="text-base font-bold font-display text-white mb-1">Stay Ahead of the META</h4>
            <p className="text-xs text-slate-300 mb-4">
              Daily gaming briefings and hardware reports delivered straight to your inbox.
            </p>
            <Link
              to="/#newsletter"
              className="inline-block w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Subscribe Free
            </Link>
          </div>
        </aside>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section aria-label="Related Articles" className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Related Briefings & Dispatches
            </h3>
            <Link
              to={`/${article.category}`}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              More in {article.category.replace('-', ' ')} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map(rel => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterCTA />
    </article>
  );
};
