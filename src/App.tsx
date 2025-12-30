import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Home from '@/pages/Home';
import MarketDetail from '@/pages/MarketDetail';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market/:symbol" element={<MarketDetail />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
