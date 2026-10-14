import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { api, getAuthToken, API_BASE_URL } from '../../services/apiClient';
import { Button } from '../../components/common/Button';

export const AdminMediaPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const sampleLibrary = [
    { title: 'GTA 6 Vice City Sunset', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&h=900&q=80' },
    { title: 'Elden Ring Erdtree', url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&h=700&q=80' },
    { title: 'RTX 5090 Benchmark Hardware', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80' },
    { title: 'Esports Championship Arena', url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80' },
    { title: 'Snapdragon Handheld Gaming', url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=1600&q=80' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
      setStatusMessage('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/admin/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: formData,
      });

      const body = await res.json();

      if (!res.ok || body.success === false) {
        if (body.code === 'MEDIA_SERVICE_NOT_CONFIGURED') {
          setError(
            'Cloudinary media upload service is not configured in this environment. Existing local/remote images continue to render smoothly. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the backend environment to enable uploads.'
          );
        } else {
          setError(body.message || 'Image upload failed');
        }
        return;
      }

      setUploadedUrl(body.data.url);
      setStatusMessage('Image successfully uploaded to Cloudinary CDN!');
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to media server');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Media Assets & Upload
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload featured images and hero banners to Cloudinary CDN storage.
        </p>
      </div>

      {/* Cloudinary Info Banner */}
      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Media Upload Architecture</p>
          <p className="text-purple-300 leading-relaxed">
            In production, image uploads are sent to Cloudinary via server-side authenticated APIs. When credentials are not provided, articles use direct HTTPS image URLs, preserving full layout fidelity.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h2 className="text-base font-bold text-white font-display">Upload New Image</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-950/40">
            <Upload className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">
              Select or drop an image file
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Supports JPEG, PNG, WebP, GIF, and SVG up to 5MB
            </p>

            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Browse Local Files</span>
            </label>

            {selectedFile && (
              <p className="mt-3 text-xs text-purple-400 font-medium">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isUploading}
            disabled={!selectedFile}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload to Media Storage
          </Button>
        </form>

        {uploadedUrl && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={uploadedUrl} alt="Uploaded" className="w-12 h-12 object-cover rounded-lg shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Uploaded CDN URL</p>
                <p className="text-xs text-slate-400 font-mono truncate">{uploadedUrl}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(uploadedUrl)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Existing Editorial Asset Library */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-display">
          Sample Media Assets in Circulation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleLibrary.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="h-32 rounded-lg overflow-hidden bg-slate-900">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-white truncate">{item.title}</p>
                <button
                  onClick={() => copyToClipboard(item.url)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors shrink-0"
                  title="Copy Image URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
