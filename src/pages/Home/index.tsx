import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Row, Col, Statistic, Button, Space } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import MarketSelector from '../../components/MarketSelector/MarketSelector';
import KLineChart from '../../components/KLineChart/KLineChart';
import ThemeToggle from '../../components/ThemeToggle';
import { getKLineData } from '../../api/marketApi';
import type { KLineData, PeriodType } from '../../types/market';
import './index.css';

const PRESET_MARKETS = [
  { label: '沪深300', value: '000300.SH' },
  { label: '上证指数', value: '000001.SH' },
  { label: '深证成指', value: '399001.SZ' },
  { label: '创业板指', value: '399006.SZ' },
  { label: '中证500', value: '000905.SH' },
  { label: '中证1000', value: '000852.SH' },
];

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('000300.SH');
  const [marketName, setMarketName] = useState<string>('沪深300');
  const [period, setPeriod] = useState<PeriodType>('day');
  const [klineData, setKlineData] = useState<KLineData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 市场概况数据（模拟数据）
  const marketOverview = {
    changePercent: 1.25,
    volume: 1250000000,
    pe: 12.5,
  };

  // 处理市场选择
  const handleMarketChange = (value: string) => {
    const selectedOption = PRESET_MARKETS.find(
      (item) => item.value === value
    );
    setSelectedMarket(value);
    setMarketName(selectedOption?.label || '');
    fetchKlineData(value, period);
  };

  // 处理周期切换
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    fetchKlineData(selectedMarket, newPeriod);
  };

  // 处理全屏切换
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (contentRef.current?.requestFullscreen) {
        contentRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 获取K线数据（模拟数据）
  const fetchKlineData = async (symbol: string, period: PeriodType) => {
    setLoading(true);
    try {
      const data = await getKLineData(symbol, period);
      setKlineData(data);
    } catch (error) {
      console.error('获取K线数据失败:', error);
      // 如果API调用失败，使用模拟数据作为后备
      const mockData: KLineData[] = generateMockKlineData(100);
      setKlineData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟K线数据
  const generateMockKlineData = (count: number): KLineData[] => {
    const data: KLineData[] = [];
    const basePrice = 3000;
    let currentPrice = basePrice;

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (count - i));
      const dateStr = date.toISOString().split('T')[0];

      const change = (Math.random() - 0.5) * 100;
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      const volume = Math.floor(Math.random() * 1000000000) + 500000000;

      data.push({
        date: dateStr,
        open: Number(open.toFixed(2)),
        close: Number(close.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        volume,
      });

      currentPrice = close;
    }

    return data;
  };

  // 初始化加载数据
  useEffect(() => {
    fetchKlineData(selectedMarket, period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout className="home-layout">
      <Layout className="home-content-layout">
        <Header className="home-header">
          <div className="header-content">
            <div className="header-left">
              <h2 className="market-title">{marketName}</h2>
            </div>
            <div className="header-right">
              <Space>
                <div className="market-selector-container">
                  <MarketSelector
                    value={selectedMarket}
                    onChange={handleMarketChange}
                    placeholder="请选择市场"
                    style={{ width: 200 }}
                  />
                </div>
                <ThemeToggle />
                <Button
                  type="text"
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={handleFullscreenToggle}
                >
                  {isFullscreen ? '退出全屏' : '全屏'}
                </Button>
              </Space>
            </div>
          </div>
        </Header>

        <Content ref={contentRef} className="home-content">
          <div className="chart-container">
            <KLineChart
              data={klineData}
              symbol={selectedMarket}
              period={period}
              loading={loading}
              height={600}
              onPeriodChange={handlePeriodChange}
            />
          </div>
        </Content>

        <Footer className="home-footer">
          <Card variant="borderless" className="overview-card">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="涨跌幅"
                  value={marketOverview.changePercent}
                  precision={2}
                  suffix="%"
                  styles={{ content: { color: marketOverview.changePercent >= 0 ? '#cf1322' : '#3f8600' } }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="成交量"
                  value={marketOverview.volume}
                  precision={0}
                  styles={{ content: { fontSize: '18px' } }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="市盈率"
                  value={marketOverview.pe}
                  precision={2}
                  styles={{ content: { fontSize: '18px' } }}
                />
              </Col>
            </Row>
          </Card>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;