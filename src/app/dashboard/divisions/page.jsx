'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Pagination from '@/components/Pagination';
import DivisionModal from './components/DivisionModal';

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  const fetchDivisions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        ...(searchTerm && { name: searchTerm }),
      });

      const response = await axios.get(`/divisions?${params}`);
      setDivisions(response.data.data.divisions || []);
      setTotalPages(Math.ceil((response.data.pagination?.total || 0) / perPage));
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (division) => {
    setSelectedDivision(division);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this division?')) return;

    try {
      await axios.delete(`/divisions/${id}`);
      fetchDivisions();
    } catch (error) {
      console.error('Failed to delete division:', error);
      alert('Failed to delete division');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDivision(null);
  };

  const handleSubmitSuccess = () => {
    handleModalClose();
    fetchDivisions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Divisions 🏢
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-linear-to-br from-cyan-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 font-medium flex items-center space-x-2"
        >
          <span>＋</span>
          <span>Buat Divisi</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Cari nama divisi"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all duration-300 font-medium"
          >
            Cair
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : divisions.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
            <div className="text-4xl mb-2">📭</div>
            <p className="font-medium">Belum ada disivi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Edit/Hapos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {divisions.map((division) => (
                  <tr key={division.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                      {division.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(division.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(division)}
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 px-2 py-1 rounded-lg transition-colors"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(division.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                      >
                        🗑 hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* Modal */}
      {modalOpen && (
        <DivisionModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          division={selectedDivision}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
