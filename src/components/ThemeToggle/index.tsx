import React, { useState, useEffect } from 'react';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

/**
 * 主题切换组件
 * 支持亮色/暗色主题切换
 */
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="切换主题"
      title={isDark ? '切换到亮色主题' : '切换到暗色主题'}
    >
      {isDark ? (
        <SunOutlined className="text-xl text-yellow-500" />
      ) : (
        <MoonOutlined className="text-xl text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
