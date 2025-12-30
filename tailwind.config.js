/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用基于 class 的暗色模式
  theme: {
    extend: {
      // 响应式断点
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      // 自定义颜色
      colors: {
        // K线图颜色
        'kline-up': '#ef5350',      // 涨（红）
        'kline-down': '#26a69a',    // 跌（绿）
        'kline-up-light': '#ffcdd2',
        'kline-down-light': '#b2dfdb',

        // 主题颜色
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },

        // 暗色主题颜色
        dark: {
          bg: '#141414',
          surface: '#1f1f1f',
          border: '#303030',
          text: '#e0e0e0',
          textSecondary: '#a0a0a0',
        },

        // 边框颜色
        border: '#e5e7eb',
      },
      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 自定义阴影
      boxShadow: {
        'kline': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'kline-dark': '0 2px 8px rgba(0, 0, 0, 0.5)',
      },
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}