import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import KLineChart from '@/components/KLineChart';
import { getKLineData } from '@/api/marketApi';
import type { KLineData, PeriodType, IndicatorType } from '@/types/market';
import './index.css';

const PRESET_MARKETS = [
  { label: '沪深300', value: '000300.SH' },
  { label: '上证指数', value: '000001.SH' },
  { label: '深证成指', value: '399001.SZ' },
  { label: '创业板指', value: '399006.SZ' },
  { label: '中证500', value: '000905.SH' },
  { label: '中证1000', value: '000852.SH' },
];

const MarketDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [klineData, setKlineData] = useState<KLineData[]>([]);
  const [period, setPeriod] = useState<PeriodType>('day');

  useEffect(() => {
    if (symbol) {
      fetchKLineData(symbol, period);
    }
  }, [symbol, period]);

  const fetchKLineData = async (marketSymbol: string, timePeriod: PeriodType) => {
    setLoading(true);
    try {
      // 调用真实API获取K线数据
      const data = await getKLineData(marketSymbol, timePeriod);
      setKlineData(data);
    } catch (error) {
      message.error('获取K线数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="market-detail-container">
      <Card
        title={`${symbol} - K线图`}
        className="market-detail-card"
        extra={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              className="back-button"
            >
              返回
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <KLineChart 
            data={klineData} 
            symbol={symbol || ''} 
            period={period}
            loading={loading} 
            height={500}
            onPeriodChange={handlePeriodChange}
          />
        </Spin>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={6}>
          <Card title="当前价格" bordered={false} className="stat-card">
            <p className="stat-value">
              {klineData.length > 0 ? klineData[klineData.length - 1].close.toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="最高价" bordered={false} className="stat-card">
            <p className="stat-value">
              {klineData.length > 0 ? Math.max(...klineData.map(d => d.high)).toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="最低价" bordered={false} className="stat-card">
            <p className="stat-value">
              {klineData.length > 0 ? Math.min(...klineData.map(d => d.low)).toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="成交量" bordered={false} className="stat-card">
            <p className="stat-value">
              {klineData.length > 0 ? klineData[klineData.length - 1].volume.toLocaleString() : '--'}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketDetail;