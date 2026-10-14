import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { api } from '../../services/apiClient';
import { Button } from '../../components/common/Button';

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

export const AdminTagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<TagItem[]>('/admin/tags');
      setTags(data);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to load tags' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('/admin/tags', { name: newTagName.trim() });
      setNewTagName('');
      setActionMessage({ type: 'success', text: 'Tag created successfully!' });
      loadTags();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to create tag' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete tag "${name}"?`)) return;

    try {
      await api.delete(`/admin/tags/${id}`);
      setActionMessage({ type: 'success', text: 'Tag deleted successfully.' });
      loadTags();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to delete tag' });
    }
  };

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Tag Taxonomy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage keyword tags used to power related story recommendations and topic hubs.
        </p>
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

      {/* Create Tag Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name (e.g. Unreal Engine 5)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-purple-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Tag
          </Button>
        </form>
      </div>

      {/* Tags Cloud / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Tags ({filtered.length})
          </span>
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tags..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {filtered.map((t) => (
              <div
                key={t.id || t.slug}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 group hover:border-slate-700"
              >
                <span className="font-medium text-white">{t.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">#{t.slug}</span>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                  title="Delete tag"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
