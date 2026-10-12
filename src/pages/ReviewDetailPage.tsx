import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Review, Game, Article, Author } from '../types';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ReviewScore } from '../components/reviews/ReviewScore';
import { ReviewBreakdown } from '../components/reviews/ReviewBreakdown';
import { ProsCons } from '../components/reviews/ProsCons';
import { AuthorCard } from '../components/article/AuthorCard';
import { ArticleCard } from '../components/cards/ArticleCard';
import { ArticleShare } from '../components/article/ArticleShare';
import { AdSlot } from '../components/common/AdSlot';
import { ArticleSkeleton } from '../components/common/LoadingSkeleton';
import { formatDate } from '../utils/formatDate';
import { Calendar, Gamepad2, Award } from 'lucide-react';
import { BRAND } from '../config/brand';
import { NotFoundPage } from './NotFoundPage';


export const ReviewDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!slug) return;
      setIsLoading(true);

      try {
        const rev = await contentService.getReviewBySlug(slug);
        if (rev) {
          setReview(rev);
          const [gm, auth, rel] = await Promise.all([
            contentService.getGameById(rev.gameId),
            contentService.getAuthorById(rev.authorId),
            contentService.getGameArticles(rev.gameId),
          ]);
          setGame(gm || null);
          setAuthor(auth || null);
          setRelatedArticles(rel);
        } else {
          setReview(null);
        }
      } catch (err) {
        console.error('Failed to load review', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (!review) return <NotFoundPage />;

  const breadcrumbs = [
    { label: 'REVIEWS', href: '/reviews' },
    { label: review.title },
  ];

  const heroImage = review.coverImage || game?.heroImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&h=900&q=80';

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <SEO
        title={`${review.title} — ${review.score}/10`}
        description={review.verdict}
        ogImage={heroImage}
        ogType="article"
        publishedTime={review.publishedAt}
        authorName={author?.name || BRAND.author}
        canonicalUrl={`${BRAND.url}/reviews/${review.slug}`}
        schemaType="Review"
        reviewScore={review.score}
        breadcrumbs={[
          { name: 'Home', url: BRAND.url },
          { name: 'Reviews', url: `${BRAND.url}/reviews` },
          { name: review.title, url: `${BRAND.url}/reviews/${review.slug}` },
        ]}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Game Review Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl p-6 sm:p-10 lg:p-12 text-white">
        {/* Background artwork */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={review.title}
            className="w-full h-full object-cover opacity-30 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cover & Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white shadow-md">
                Official Review
              </span>
              {game && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-md">
                  {game.genre}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
              {review.title}
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {review.verdict}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Reviewed {formatDate(review.publishedAt)}
              </span>
              {author && (
                <>
                  <span>•</span>
                  <span>By {author.name}</span>
                </>
              )}
              {game && (
                <>
                  <span>•</span>
                  <Link
                    to={`/games/${game.slug}`}
                    className="text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <Gamepad2 className="w-3 h-3" />
                    <span>View Game Hub</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Editorial Score Showcase */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <ReviewScore score={review.score} size="lg" className="w-full max-w-[280px]" />
          </div>
        </div>
      </div>

      {/* Game Fact Sheet & Quick Specs */}
      {game && (
        <section aria-label="Game Quick Facts" className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-semibold mb-1">Developer</span>
            <span className="font-bold text-slate-900 dark:text-white">{game.developer}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-semibold mb-1">Publisher</span>
            <span className="font-bold text-slate-900 dark:text-white">{game.publisher}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-semibold mb-1">Platforms</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {game.platforms.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-semibold mb-1">Release Date</span>
            <span className="font-bold text-slate-900 dark:text-white">{game.releaseDate}</span>
          </div>
        </section>
      )}

      {/* Main Review Grid: Breakdown, Pros/Cons, Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Pros/Cons & Breakdown */}
        <div className="lg:col-span-8 space-y-10">
          {/* Pros & Cons */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
              The Verdict Breakdown
            </h2>
            <ProsCons pros={review.pros} cons={review.cons} />
          </div>

          {/* Scoring Breakdown (Gameplay, Graphics, Performance, Audio, Replayability) */}
          <ReviewBreakdown review={review} />

          {/* Final Editorial Verdict Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-purple-950/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Award className="w-4 h-4" />
              <span>Final Editorial Verdict</span>
            </div>
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic">
              “{review.finalVerdict}”
            </p>
          </div>

          {/* Share row */}
          <div className="py-4 border-y border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Share this review:</span>
            <ArticleShare title={review.title} />
          </div>

          {/* Author Card */}
          {author && <AuthorCard author={author} />}
        </div>

        {/* Right Column: Sidebar with Ad & Game Details */}
        <aside className="lg:col-span-4 space-y-8">
          <AdSlot variant="sidebar" slotId="review-detail-sidebar" />

          {game && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
              <h3 className="font-bold font-display text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                About The Game
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {game.description}
              </p>
              <Link
                to={`/games/${game.slug}`}
                className="block w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold text-center transition-all shadow-md"
              >
                Go to {game.title} Hub &rarr;
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Related News & Guides for this game */}
      {relatedArticles.length > 0 && (
        <section aria-label="Related Game Articles" className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Related News & Guides for {game?.title || 'This Title'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map(art => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
