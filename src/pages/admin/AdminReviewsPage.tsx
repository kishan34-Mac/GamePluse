import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { Review, Game } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { Button } from '../../components/common/Button';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [gameId, setGameId] = useState('');
  const [score, setScore] = useState(9.0);
  const [verdict, setVerdict] = useState('');
  const [finalVerdict, setFinalVerdict] = useState('');
  const [prosInput, setProsInput] = useState('');
  const [consInput, setConsInput] = useState('');
  const [gameplayScore, setGameplayScore] = useState(9.0);
  const [gameplayDetails, setGameplayDetails] = useState('');
  const [graphicsScore, setGraphicsScore] = useState(9.0);
  const [graphicsDetails, setGraphicsDetails] = useState('');
  const [performanceScore, setPerformanceScore] = useState(9.0);
  const [performanceDetails, setPerformanceDetails] = useState('');
  const [audioScore, setAudioScore] = useState(9.0);
  const [audioDetails, setAudioDetails] = useState('');
  const [replayabilityScore, setReplayabilityScore] = useState(9.0);
  const [replayabilityDetails, setReplayabilityDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [revs, gms] = await Promise.all([
        api.get<Review[]>('/admin/reviews'),
        api.get<Game[]>('/admin/games'),
      ]);
      setReviews(revs);
      setGames(gms);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to load reviews' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setGameId(games[0]?.id || games[0]?.slug || '');
    setScore(9.0);
    setVerdict('');
    setFinalVerdict('');
    setProsInput('');
    setConsInput('');
    setGameplayScore(9.0);
    setGameplayDetails('Exceptional combat mechanics and controls.');
    setGraphicsScore(9.0);
    setGraphicsDetails('Stunning visual fidelity and art direction.');
    setPerformanceScore(9.0);
    setPerformanceDetails('Solid framerates and stable frame timing.');
    setAudioScore(9.0);
    setAudioDetails('Immersive soundscape and orchestral score.');
    setReplayabilityScore(9.0);
    setReplayabilityDetails('Vast build variety and post-game depth.');
    setIsModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setEditingId(rev.id);
    setTitle(rev.title);
    setSlug(rev.slug);
    setGameId(rev.gameId);
    setScore(rev.score);
    setVerdict(rev.verdict);
    setFinalVerdict(rev.finalVerdict || rev.verdict);
    setProsInput((rev.pros || []).join('\n'));
    setConsInput((rev.cons || []).join('\n'));
    setGameplayScore(rev.gameplay?.score || 9.0);
    setGameplayDetails(rev.gameplay?.details || '');
    setGraphicsScore(rev.graphics?.score || 9.0);
    setGraphicsDetails(rev.graphics?.details || '');
    setPerformanceScore(rev.performance?.score || 9.0);
    setPerformanceDetails(rev.performance?.details || '');
    setAudioScore(rev.audio?.score || 9.0);
    setAudioDetails(rev.audio?.details || '');
    setReplayabilityScore(rev.replayability?.score || 9.0);
    setReplayabilityDetails(rev.replayability?.details || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !gameId || !verdict.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        gameId,
        score: Number(score),
        verdict: verdict.trim(),
        finalVerdict: finalVerdict.trim() || verdict.trim(),
        pros: prosInput.split('\n').map((p) => p.trim()).filter(Boolean),
        cons: consInput.split('\n').map((c) => c.trim()).filter(Boolean),
        gameplay: { score: Number(gameplayScore), details: gameplayDetails.trim() || 'Good' },
        graphics: { score: Number(graphicsScore), details: graphicsDetails.trim() || 'Good' },
        performance: { score: Number(performanceScore), details: performanceDetails.trim() || 'Good' },
        audio: { score: Number(audioScore), details: audioDetails.trim() || 'Good' },
        replayability: { score: Number(replayabilityScore), details: replayabilityDetails.trim() || 'Good' },
        status: 'published',
        authorId: 'author-marcus-vance',
      };

      if (editingId) {
        await api.patch(`/admin/reviews/${editingId}`, payload);
        setActionMessage({ type: 'success', text: 'Review updated successfully!' });
      } else {
        await api.post('/admin/reviews', payload);
        setActionMessage({ type: 'success', text: 'Review published successfully!' });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review "${name}"?`)) return;

    try {
      await api.delete(`/admin/reviews/${id}`);
      setActionMessage({ type: 'success', text: 'Review deleted successfully.' });
      loadData();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to delete review' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Editorial Reviews
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish comprehensive scored reviews with structured breakdowns and pros/cons.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish Review
        </Button>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs underline hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Review Title</th>
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reviews.map((r) => (
                  <tr key={r.id || r.slug} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="min-w-0 max-w-md">
                        <p className="font-semibold text-white truncate text-sm">{r.title}</p>
                        <p className="text-xs text-slate-500 truncate">/reviews/{r.slug}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {games.find((g) => g.id === r.gameId || g.slug === r.gameId)?.title || r.gameId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {r.score.toFixed(1)} / 10
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {formatDate(r.publishedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/reviews/${r.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Public Review"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 transition-colors"
                          title="Edit Review"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4 my-8">
            <h2 className="text-lg font-bold text-white font-display">
              {editingId ? 'Edit Review' : 'Create Scored Review'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Elden Ring: Shadow of the Erdtree Review — A Monumental Triumph"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Game *</label>
                  <select
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  >
                    {games.map((g) => (
                      <option key={g.id || g.slug} value={g.slug || g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overall Score (0 - 10) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Executive Verdict *</label>
                <textarea
                  rows={2}
                  required
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                  placeholder="Summary paragraph encapsulating the critical assessment..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pros (One per line)</label>
                  <textarea
                    rows={3}
                    value={prosInput}
                    onChange={(e) => setProsInput(e.target.value)}
                    placeholder="Incredible combat geometry&#10;Masterclass soundtrack"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cons (One per line)</label>
                  <textarea
                    rows={3}
                    value={consInput}
                    onChange={(e) => setConsInput(e.target.value)}
                    placeholder="Occasional frame drops&#10;Punishing difficulty spike"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Save Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
