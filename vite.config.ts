import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 开发环境代理配置
  server: {
    proxy: {
      // 东方财富API代理配置
      '/api': {
        target: 'https://push2his.eastmoney.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        headers: {
          'Referer': 'https://push2his.eastmoney.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
      }
    }
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 优化打包大小
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'chart-vendor': ['klinecharts'],
        }
      }
    }
  },
  // 预览服务器配置（模拟生产环境）
  preview: {
    proxy: {
      '/api': {
        target: 'https://push2his.eastmoney.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        headers: {
          'Referer': 'https://push2his.eastmoney.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
      }
    }
  }
})
