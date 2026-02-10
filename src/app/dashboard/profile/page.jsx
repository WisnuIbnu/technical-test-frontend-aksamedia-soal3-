'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });


  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setFormData(prev => {
          if (
            prev.name === (user.name || '') &&
            prev.username === (user.username || '') &&
            prev.email === (user.email || '')
          ) {
            return prev; 
          }
          
          return {
            ...prev,
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
          };
        });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    const dataToSend = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
    };

    const result = await updateProfile(dataToSend);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
        👤 Edit Profile
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
              : 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Password Baru (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Ketik Ulang Password Baru 
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>
          </div>


          <div className="mt-8 flex items-center justify-between">
            {/* KIRI */}
            <Link
              href="/dashboard"
              className="px-4 py-2 border rounded-xl text-white border-neutral-200 dark:border-neutral-700"
            >
              Dashboard
            </Link>

            {/* KANAN */}
            <div className="flex space-x-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                  }));
                }}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-linear-to-br from-indigo-500 to-indigo-600 border border-transparent rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? '⏳ Update' : '💾 Simpan'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}