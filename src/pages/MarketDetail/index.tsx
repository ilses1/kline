import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import KLineChart from '@/components/KLineChart';
import { getKLineData } from '@/api/marketApi';
import type { KLineData, PeriodType, IndicatorType } from '@/types/market';

const MarketDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [klineData, setKlineData] = useState<KLineData[]>([]);
  const [period, setPeriod] = useState<PeriodType>('day');
  const [indicator, setIndicator] = useState<IndicatorType>('MA');

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

  const handleIndicatorChange = (newIndicator: IndicatorType) => {
    setIndicator(newIndicator);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={`${symbol} - K线图`}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
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
            onIndicatorChange={handleIndicatorChange}
          />
        </Spin>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={6}>
          <Card title="当前价格" bordered={false}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {klineData.length > 0 ? klineData[klineData.length - 1].close.toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="最高价" bordered={false}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {klineData.length > 0 ? Math.max(...klineData.map(d => d.high)).toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="最低价" bordered={false}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {klineData.length > 0 ? Math.min(...klineData.map(d => d.low)).toFixed(2) : '--'}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="成交量" bordered={false}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {klineData.length > 0 ? klineData[klineData.length - 1].volume.toLocaleString() : '--'}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketDetail;