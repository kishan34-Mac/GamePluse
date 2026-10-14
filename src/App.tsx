import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { GameHubPage } from './pages/GameHubPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin CMS Components & Pages
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminArticleEditorPage } from './pages/admin/AdminArticleEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminTagsPage } from './pages/admin/AdminTagsPage';
import { AdminGamesPage } from './pages/admin/AdminGamesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Admin CMS Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="articles" element={<AdminArticlesPage />} />
                <Route path="articles/new" element={<AdminArticleEditorPage />} />
                <Route path="articles/:id/edit" element={<AdminArticleEditorPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="tags" element={<AdminTagsPage />} />
                <Route path="games" element={<AdminGamesPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Public Website Routes */}
              <Route path="/" element={<Layout />}>
                {/* Homepage */}
                <Route index element={<HomePage />} />

                {/* Category Pages */}
                <Route path="news" element={<CategoryPage forcedCategory="news" />} />
                <Route path="reviews" element={<CategoryPage forcedCategory="reviews" />} />
                <Route path="guides" element={<CategoryPage forcedCategory="guides" />} />
                <Route path="pc-gaming" element={<CategoryPage forcedCategory="pc-gaming" />} />
                <Route path="mobile-gaming" element={<CategoryPage forcedCategory="mobile-gaming" />} />
                <Route path="esports" element={<CategoryPage forcedCategory="esports" />} />

                {/* Dynamic Category Page Route */}
                <Route path="category/:categorySlug" element={<CategoryPage />} />

                {/* Review Detail Route */}
                <Route path="reviews/:slug" element={<ReviewDetailPage />} />

                {/* Article Detail Routes */}
                <Route path="news/:slug" element={<ArticlePage />} />
                <Route path="guides/:slug" element={<ArticlePage />} />
                <Route path="pc-gaming/:slug" element={<ArticlePage />} />
                <Route path="mobile-gaming/:slug" element={<ArticlePage />} />
                <Route path="esports/:slug" element={<ArticlePage />} />

                {/* Game Hub */}
                <Route path="games/:slug" element={<GameHubPage />} />

                {/* Search */}
                <Route path="search" element={<SearchPage />} />

                {/* Static Pages */}
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy-policy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="disclaimer" element={<DisclaimerPage />} />

                {/* 404 Wildcard */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
