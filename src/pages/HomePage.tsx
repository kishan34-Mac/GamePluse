import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Article, Review, Product, Game } from '../types';
import { SEO } from '../components/common/SEO';
import { TrendingBar } from '../components/common/TrendingBar';
import { FeaturedArticle } from '../components/cards/FeaturedArticle';
import { ArticleCard } from '../components/cards/ArticleCard';
import { CompactArticleCard } from '../components/cards/CompactArticleCard';
import { ReviewCard } from '../components/cards/ReviewCard';
import { AffiliateProductCard } from '../components/cards/AffiliateProductCard';
import { NewsletterCTA } from '../components/common/NewsletterCTA';
import { AdSlot } from '../components/common/AdSlot';
import { PageSkeleton } from '../components/common/LoadingSkeleton';
import { ArrowRight, Sparkles, Monitor, Smartphone, Trophy, BookOpen, Star, Flame, ShoppingBag } from 'lucide-react';
import { BRAND } from '../config/brand';


export const HomePage: React.FC = () => {
  const [heroArticle, setHeroArticle] = useState<Article | null>(null);
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [guides, setGuides] = useState<Article[]>([]);
  const [pcGaming, setPcGaming] = useState<Article[]>([]);
  const [mobileGaming, setMobileGaming] = useState<Article[]>([]);
  const [esports, setEsports] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [
          featured,
          news,
          picks,
          revs,
          gds,
          pc,
          mobile,
          esp,
          prods,
          allGames,
        ] = await Promise.all([
          contentService.getFeaturedArticles(),
          contentService.getArticles({ category: 'news', limit: 4 }),
          contentService.getEditorsPicks(),
          contentService.getReviews(),
          contentService.getArticles({ category: 'guides', limit: 4 }),
          contentService.getArticles({ category: 'pc-gaming', limit: 4 }),
          contentService.getArticles({ category: 'mobile-gaming', limit: 4 }),
          contentService.getArticles({ category: 'esports', limit: 4 }),
          contentService.getProducts(),
          contentService.getGames(),
        ]);

        setHeroArticle(featured[0] || news[0]);
        setNewsArticles(news);
        setEditorsPicks(picks);
        setReviews(revs);
        setGuides(gds);
        setPcGaming(pc);
        setMobileGaming(mobile);
        setEsports(esp);
        setProducts(prods);
        setGames(allGames);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const primaryNews = newsArticles[0];
  const secondaryNews = newsArticles.slice(1, 4);

  return (
    <div className="space-y-14 sm:space-y-20">
      <SEO
        title="The Pulse of Gaming"
        description={BRAND.name + ' covers gaming news, reviews, guides, PC hardware, and esports.'}
      />

      {/* 1. Hero Story (Cinematic Editorial Dominant Story) */}
      {heroArticle && (
        <section aria-label="Hero Featured Story" className="relative">
          <FeaturedArticle article={heroArticle} isHero={true} />
        </section>
      )}

      {/* 2. Trending Bar */}
      <section aria-label="Trending Topics">
        <TrendingBar />
      </section>

      {/* Monetization Leaderboard AdSlot */}
      <AdSlot variant="leaderboard" slotId="home-leaderboard-top" />

      {/* 3. Latest Gaming News (1 Dominant + 3 Secondary) */}
      <section aria-label="Latest Gaming News" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Latest Dispatches</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Latest Gaming News
            </h2>
          </div>
          <Link
            to="/news"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>View All News</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Dominant News Card */}
          {primaryNews && (
            <div className="lg:col-span-7 flex flex-col">
              <ArticleCard article={primaryNews} className="h-full" />
            </div>
          )}

          {/* Secondary News Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {secondaryNews.map(item => (
              <ArticleCard key={item.id} article={item} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editor's Picks (Varied Editorial Layout) */}
      {editorsPicks.length > 0 && (
        <section aria-label="Editor's Picks" className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Handpicked Journalism</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                Editor’s Picks
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large feature */}
            {editorsPicks[0] && (
              <div className="md:col-span-2 lg:col-span-2">
                <FeaturedArticle article={editorsPicks[0]} />
              </div>
            )}

            {/* Compact column */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Trending Debates
                </h3>
                <div className="space-y-1">
                  {editorsPicks.slice(1, 4).map((item, idx) => (
                    <CompactArticleCard key={item.id} article={item} indexNumber={idx + 1} />
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/news"
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Explore Complete Archive &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Game Reviews */}
      <section aria-label="Game Reviews" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>Critical Assessment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Game Reviews
            </h2>
          </div>
          <Link
            to="/reviews"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>All Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map(rev => {
            const matchedGame = games.find(g => g.id === rev.gameId);
            return <ReviewCard key={rev.id} review={rev} game={matchedGame} />;
          })}
        </div>
      </section>

      {/* 6. Gaming Guides */}
      <section aria-label="Gaming Guides" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Strategies & Walkthroughs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Gaming Guides
            </h2>
          </div>
          <Link
            to="/guides"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map(guide => (
            <ArticleCard key={guide.id} article={guide} />
          ))}
        </div>
      </section>

      {/* In-Feed Native AdSlot */}
      <AdSlot variant="inFeed" slotId="home-infeed-middle" />

      {/* 7. PC Gaming Section */}
      <section aria-label="PC Gaming" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Monitor className="w-3.5 h-3.5" />
              <span>Silicon & Rigs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              PC Gaming
            </h2>
          </div>
          <Link
            to="/pc-gaming"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>Explore PC Gaming</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pcGaming.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 8. Mobile Gaming Section */}
      <section aria-label="Mobile Gaming" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Portable Hitmakers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Mobile Gaming
            </h2>
          </div>
          <Link
            to="/mobile-gaming"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>Explore Mobile Gaming</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobileGaming.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 9. Esports Section (Competitive Styling) */}
      <section aria-label="Esports Coverage" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>Championship Arena</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Esports
            </h2>
          </div>
          <Link
            to="/esports"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>All Esports</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {esports.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 10. Recommended Gaming Gear */}
      <section aria-label="Recommended Gaming Gear" className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tested & Approved</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Recommended Gaming Gear
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Curated lab benchmarks • Zero sponsored rankings
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(prod => (
            <AffiliateProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 11. Newsletter */}
      <NewsletterCTA />
    </div>
  );
};
