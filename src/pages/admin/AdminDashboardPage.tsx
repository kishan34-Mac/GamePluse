import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FolderTree,
  Gamepad2,
  Star,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/apiClient';
import { Article } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface DashboardData {
  articles: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
  categories: number;
  games: number;
  reviews: number;
  authors: number;
  subscribers: number;
  recentArticles: Article[];
}

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await api.get<DashboardData>('/admin/dashboard');
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
        <p>{error || 'Failed to connect to dashboard API'}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Published Articles',
      value: data.articles.published,
      sub: `${data.articles.drafts} drafts, ${data.articles.archived} archived`,
      icon: FileText,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      href: '/admin/articles',
    },
    {
      label: 'Categories',
      value: data.categories,
      sub: 'Editorial taxonomies',
      icon: FolderTree,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      href: '/admin/categories',
    },
    {
      label: 'Games Indexed',
      value: data.games,
      sub: `${data.reviews} scored reviews`,
      icon: Gamepad2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/games',
    },
    {
      label: 'Active Subscribers',
      value: data.subscribers,
      sub: 'Newsletter audience',
      icon: Users,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      href: '#',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Editorial Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status of publication pipeline, content records, and newsletter reach.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.href}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl border ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {card.value}
              </span>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{card.label}</p>
              <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Content Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Recently Modified Articles
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Articles recently created, edited, or queued for review.
            </p>
          </div>
          <Link
            to="/admin/articles"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300"
          >
            View all articles →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 sm:px-6">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.recentArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={art.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div className="min-w-0 max-w-md">
                        <p className="font-semibold text-white truncate text-sm">{art.title}</p>
                        <p className="text-xs text-slate-500 truncate">/{art.category}/{art.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 capitalize">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        art.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : art.status === 'draft'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {formatDate(art.updatedAt || art.publishedAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/articles/${art.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      {art.status === 'published' && (
                        <a
                          href={`/${art.category}/${art.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
