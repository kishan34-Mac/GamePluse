import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Article, Category, Review, Game } from '../types';
import { SEO } from '../components/common/SEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FeaturedArticle } from '../components/cards/FeaturedArticle';
import { ArticleCard } from '../components/cards/ArticleCard';
import { CompactArticleCard } from '../components/cards/CompactArticleCard';
import { ReviewCard } from '../components/cards/ReviewCard';
import { Pagination } from '../components/common/Pagination';
import { AdSlot } from '../components/common/AdSlot';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Flame, Sparkles, Filter } from 'lucide-react';
import { BRAND } from '../config/brand';
import { NotFoundPage } from './NotFoundPage';


interface CategoryPageProps {
  forcedCategory?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ forcedCategory }) => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const activeSlug = forcedCategory || categorySlug || 'news';

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setCurrentPage(1);

      try {
        const cat = await contentService.getCategoryBySlug(activeSlug);
        setCategory(cat || null);

        // Fetch category articles
        const paginated = await contentService.getPaginatedArticles(1, 9, activeSlug);
        setArticles(paginated.data);
        setTotalPages(paginated.totalPages);

        // Featured article for this category
        const allCatArticles = await contentService.getArticles({ category: activeSlug });
        const featured = allCatArticles.find(a => a.featured) || allCatArticles[0];
        setFeaturedArticle(featured || null);

        // Trending articles
        const trending = allCatArticles.filter(a => a.trending).slice(0, 5);
        setTrendingArticles(trending.length > 0 ? trending : allCatArticles.slice(0, 5));

        // If category is reviews, also fetch reviews data
        if (activeSlug === 'reviews') {
          const [allRevs, allGames] = await Promise.all([
            contentService.getReviews(),
            contentService.getGames(),
          ]);
          setReviews(allRevs);
          setGames(allGames);
        }
      } catch (err) {
        console.error('Failed to fetch category data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [activeSlug]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 380, behavior: 'smooth' });
    try {
      const paginated = await contentService.getPaginatedArticles(page, 9, activeSlug);
      setArticles(paginated.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categoryTitle = category ? category.name : activeSlug.toUpperCase().replace('-', ' ');
  const categoryDescription = category
    ? category.description
    : `Explore the latest ${categoryTitle} coverage, editorials, and guides on ${BRAND.name}.`;

  const breadcrumbs = [
    { label: categoryTitle },
  ];
  const visibleArticles = activeTab === 'latest'
    ? articles
    : articles.filter(article => activeTab === 'popular' ? article.popular : article.trending);

  if (!isLoading && !category) {
    return <NotFoundPage />;
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <SEO
        title={`${categoryTitle} | ${BRAND.name}`}
        description={categoryDescription}
        breadcrumbs={[
          { name: 'Home', url: BRAND.url },
          { name: categoryTitle, url: `${BRAND.url}/${activeSlug}` },
        ]}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Category Header */}
      <header className="relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-purple-50/30 dark:from-slate-900 dark:via-slate-900/60 dark:to-purple-950/20 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight mb-4">
            {categoryTitle}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {categoryDescription}
          </p>
        </div>
      </header>

      {/* Category Featured Story */}
      {featuredArticle && (
        <section aria-label="Category Featured Article">
          <FeaturedArticle article={featuredArticle} />
        </section>
      )}

      {/* If reviews category, display review scorecards */}
      {activeSlug === 'reviews' && reviews.length > 0 && (
        <section aria-label="Official Review Scorecards" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Official Review Database
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {reviews.length} Title Assessments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(rev => {
              const matchedGame = games.find(g => g.id === rev.gameId);
              return <ReviewCard key={rev.id} review={rev} game={matchedGame} />;
            })}
          </div>
        </section>
      )}

      {/* Filter / Sort Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            All {categoryTitle} Stories
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          {(['latest', 'popular', 'trending'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Grid */}
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : visibleArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {visibleArticles.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="pt-6"
              />
            </>
          ) : (
            <EmptyState
              title={`No ${activeTab} ${categoryTitle} Articles Found`}
              description="No locally available stories match this filter yet. Try another filter or return to the latest stories."
              actionText="Return to Homepage"
              actionHref="/"
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Trending in Category */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Trending in {categoryTitle}</span>
            </h3>

            <div className="space-y-1">
              {trendingArticles.map((art, idx) => (
                <CompactArticleCard key={art.id} article={art} indexNumber={idx + 1} />
              ))}
            </div>
          </div>

          {/* Sidebar Ad Placement */}
          <AdSlot variant="sidebar" slotId={`cat-sidebar-${activeSlug}`} />
        </aside>
      </div>
    </div>
  );
};
