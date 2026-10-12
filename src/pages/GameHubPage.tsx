import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Game, Article, Review } from '../types';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArticleCard } from '../components/cards/ArticleCard';
import { ReviewCard } from '../components/cards/ReviewCard';
import { GameCard } from '../components/cards/GameCard';
import { EmptyState } from '../components/common/EmptyState';
import { ArticleSkeleton } from '../components/common/LoadingSkeleton';
import { Star, Calendar, Building2, Monitor, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';


export const GameHubPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'guides' | 'review'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!slug) return;
      setIsLoading(true);

      try {
        const found = await contentService.getGameBySlug(slug);
        if (found) {
          setGame(found);
          const [gameArts, gameRev, allGames] = await Promise.all([
            contentService.getGameArticles(found.id),
            contentService.getReviewByGameId(found.id),
            contentService.getGames(),
          ]);

          setArticles(gameArts);
          setReview(gameRev || null);
          setRelatedGames(allGames.filter(g => g.id !== found.id).slice(0, 4));
        } else {
          setGame(null);
        }
      } catch (err) {
        console.error('Failed to load game hub', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (!game) {
    return (
      <EmptyState
        title="Game Hub Not Found"
        description="The game title you requested is not currently registered in the GAMEPULSE index."
        actionText="Back to News"
        actionHref="/news"
      />
    );
  }

  const breadcrumbs = [
    { label: 'GAMES', href: '/games' },
    { label: game.title },
  ];

  const filteredArticles = articles.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'news') return a.category === 'news';
    if (activeTab === 'guides') return a.category === 'guides';
    return true;
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <SEO
        title={`${game.title} Hub — News, Guides & Reviews`}
        description={game.description}
        ogImage={game.heroImage || game.cover}
        canonicalUrl={`${BRAND.url}/games/${game.slug}`}
        breadcrumbs={[
          { name: 'Home', url: BRAND.url },
          { name: game.title, url: `${BRAND.url}/games/${game.slug}` },
        ]}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Game Hero Hub Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl p-6 sm:p-10 lg:p-12 text-white">
        <div className="absolute inset-0">
          <img
            src={game.heroImage || game.cover}
            alt={game.title}
            className="w-full h-full object-cover opacity-25 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Game Cover Art */}
          <div className="w-36 sm:w-48 lg:w-56 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 shadow-2xl bg-slate-900">
            <img src={game.cover} alt={game.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600 text-white shadow-md">
                {game.genre}
              </span>
              {game.score && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Score: {game.score.toFixed(1)}/10</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
              {game.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {game.description}
            </p>

            {/* Quick Fact pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Dev: {game.developer}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Release: {game.releaseDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                {game.platforms.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Coverage ({articles.length + (review ? 1 : 0)})
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'news'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          News Dispatches
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'guides'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Guides & Tips
        </button>

        {review && (
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Editorial Review
          </button>
        )}
      </div>

      {/* Main Hub Content Area */}
      <div className="space-y-8">
        {activeTab === 'review' && review ? (
          <div className="max-w-2xl">
            <ReviewCard review={review} game={game} />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {review && activeTab === 'all' && (
              <ReviewCard review={review} game={game} />
            )}
            {filteredArticles.map(art => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${activeTab} Articles For This Title`}
            description="Our gaming staff has not filed reports in this subcategory yet."
            actionText="View All Coverage"
            onAction={() => setActiveTab('all')}
          />
        )}
      </div>

      {/* Related Games in Index */}
      {relatedGames.length > 0 && (
        <section aria-label="Related Games" className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              More Games to Explore
            </h3>
            <Link
              to="/reviews"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedGames.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
