import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // 在客户端渲染之前，显示一个占位符
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        title="Loading theme..."
      >
        <span className="text-gray-400 text-lg">⚪</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      title={`当前主题: ${theme === 'system' ? systemTheme : theme}`}
    >
      {theme === 'dark' ? (
        <span className="text-yellow-500 text-lg">☀️</span>
      ) : (
        <span className="blue-500 text-lg">🌙</span>
      )}
    </button>
  );
} 
