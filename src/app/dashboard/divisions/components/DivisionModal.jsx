'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

export default function DivisionModal({ isOpen, onClose, division, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name || '',
      });
    } else {
      resetForm();
    }
  }, [division]);

  const resetForm = () => {
    setFormData({
      name: '',
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (division) {
        response = await axios.put(`/divisions/${division.id}`, {
          name: formData.name,
        });
      } else {
        response = await axios.post('/divisions', {
          name: formData.name,
        });
      }

      if (response.data.status === 'success') {
        onSubmitSuccess();
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {division ? '✎ Edit Divisi' : '🏢 Buat Divisu'}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Nama Divisii
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Engineering, Marketing, dll"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500"
                />
              </div>
            </div>

            <div className="mt-7 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Keluar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-linear-to-br from-cyan-500 to-emerald-500 border border-transparent rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? '⏳ Simpen' : division ? '💾 Simpan' : '➕ Simpam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
