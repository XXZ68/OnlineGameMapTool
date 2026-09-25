import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // 1. Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // 2. Fallback to system preference if no explicit choice exists
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Persist the choice
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 font-sans font-medium transition-colors duration-200 cursor-pointer text-primary-text bg-secondary-bg hover:bg-accent-special hover:text-white border border-transparent shadow-custom"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? 'Please return to Dark mode' : '🛑'}
    </button>
  );
}
