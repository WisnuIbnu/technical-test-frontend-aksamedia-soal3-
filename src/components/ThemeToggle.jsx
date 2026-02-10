'use client';

import { useThemeContext } from '@/context/ThemeContext';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
        aria-label="Theme toggle"
      >
        {theme === 'light' && '☀️'}
        {theme === 'dark' && '🌙'}
        {theme === 'system' && '💻'}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1.5 z-50">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                toggleTheme(t.value);
                setMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                theme === t.value
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="mr-3">{t.icon}</span>
              {t.label}
              {theme === t.value && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}