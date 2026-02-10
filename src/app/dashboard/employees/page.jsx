'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Pagination from '@/components/Pagination';
import EmployeeModal from './components/EmployeeModal';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        ...(searchTerm && { name: searchTerm }),
        ...(selectedDivision && { division_id: selectedDivision }),
      });

      const response = await axios.get(`/employees?${params}`);
      setEmployees(response.data.data.employees || []);
      setTotalPages(Math.ceil((response.data.pagination?.total || 0) / perPage));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedDivision]);

  const fetchDivisions = useCallback(async () => {
    try {
      const response = await axios.get('/divisions');
      setDivisions(response.data.data.divisions || []);
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const handleDivisionFilter = (divisionId) => {
    setSelectedDivision(divisionId);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('division', divisionId);
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda Yakin Menghapus Pegawai Ini?')) return;

    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Gagal Menghapus Data Pegawai:', error);
      alert('Gagal Menghapus Data Pegawai');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmitSuccess = () => {
    handleModalClose();
    fetchEmployees();
  };

  const totalPages_calc = Math.ceil((employees.length > 0 ? totalPages * perPage : 0) / perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Employees 👥
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 font-medium flex items-center space-x-2"
        >
          <span>＋</span>
          <span>Tambah Employee</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Cari Employee"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
            />
          </div>
          <div className="flex-1">
            <select
              value={selectedDivision}
              onChange={(e) => handleDivisionFilter(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-50"
            >
              <option value="">Semua Divisi</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-medium"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
            <div className="text-4xl mb-2">📭</div>
            <p className="font-medium">Tidak Ada Employee</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    No. Telepon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Edit/Hapus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={employee.image || '/default-avatar.png'}
                        alt={employee.name}
                        className="w-10 h-10 rounded-lg object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium">
                        {employee.division?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded-lg transition-colors"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                      >
                        🗑 Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* Modal */}
      {modalOpen && (
        <EmployeeModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          employee={selectedEmployee}
          divisions={divisions}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}