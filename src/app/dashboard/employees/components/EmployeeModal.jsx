'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Image from 'next/image';

export default function EmployeeModal({ isOpen, onClose, employee, divisions, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    position: '',
    image: null,
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        phone: employee.phone || '',
        division: employee.division?.id || '',
        position: employee.position || '',
        image: null,
      });
      setPreview(employee.image || '');
    } else {
      resetForm();
    }
  }, [employee]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      division: '',
      position: '',
      image: null,
    });
    setPreview('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('division', formData.division);
      data.append('position', formData.position);
      if (formData.image) {
        data.append('image', formData.image);
      }

      let response;
      if (employee) {
        data.append('_method', 'PUT');
        response = await axios.post(`/employees/${employee.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/employees', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
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
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {employee ? '✎ Edit Employee' : '＋ Add Employee'}
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
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                  👤 Foto
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-700/50">
                    {preview ? (
                      <image
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-neutral-400 text-sm">No image</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm text-neutral-600 dark:text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-neutral-200 dark:file:border-neutral-700 file:text-sm file:font-medium file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Nama *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+62 812345678"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                />
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Divisi *
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Jabatan *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Senior Developer"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
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
                className="flex-1 px-4 py-3 bg-linear-to-br from-indigo-500 to-indigo-600 border border-transparent rounded-xl text-sm font-medium text-white hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? '⏳ Simpen...' : employee ? '💾 Simpen' : '➕ Simpne'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}