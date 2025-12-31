import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ErrorBoundary from '@/components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const MarketDetail = lazy(() => import('@/pages/MarketDetail'));

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary>
        <Router>
          <Suspense
            fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Spin tip="页面加载中..." />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market/:symbol" element={<MarketDetail />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
