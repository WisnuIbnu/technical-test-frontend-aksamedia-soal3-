'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    employees: 0,
    divisions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, divisionsRes] = await Promise.all([
        axios.get('/employees?per_page=1'),
        axios.get('/divisions?per_page=1'),
      ]);

      setStats({
        employees: employeesRes.data.pagination?.total || 0,
        divisions: divisionsRes.data.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Selamat Datang!
          </h1>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-400/10 to-cyan-400/10 rounded-full -z-10 group-hover:scale-150 transition-transform duration-300" />
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                Total Pegawai
              </p>
              <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                {stats.employees}
              </div>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.65a4.5 4.5 0 01-4.884 4.884m-4.884-4.884a4.5 4.5 0 014.884-4.884m-4.884 4.884a4.5 4.5 0 014.884-4.884" />
              </svg>
            </div>
          </div>
          
          <Link
            href="/dashboard/employees"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium group/link"
          >
            Lihat List Pegawai
            <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="group relative bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-cyan-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-400/10 to-emerald-400/10 rounded-full -z-10 group-hover:scale-150 transition-transform duration-300" />
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                Total Divisi
              </p>
              <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                {stats.divisions}
              </div>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          
          <Link
            href="/dashboard/divisions"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium group/link"
          >
            Manajemen Divisi
            <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
          Manajemen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/employees"
            className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                Manajemen Pegawai
              </span>
            </div>
            <svg className="w-5 h-5 text-neutral-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link
            href="/dashboard/profile"
            className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚙️</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                Edit Profil
              </span>
            </div>
            <svg className="w-5 h-5 text-neutral-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}