import React, { useState, useMemo } from 'react';
import { Stock } from '@ant-design/charts';
import { Card, Spin, Empty, Radio, Select, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { KLineChartProps, PeriodType, IndicatorType } from './types';
import './KLineChart.css';

const KLineChart: React.FC<KLineChartProps> = ({
  data,
  symbol,
  period,
  loading = false,
  height = 600,
  onPeriodChange,
  onIndicatorChange,
}) => {
  const [indicator, setIndicator] = useState<IndicatorType>('MA');
  const [showVolume] = useState(true);

  // 转换数据格式为 ant-design/charts 需要的格式
  const chartData = useMemo(() => {
    const result = data.map((item) => ({
      date: item.date,
      open: item.open,
      close: item.close,
      low: item.low,
      high: item.high,
      volume: item.volume,
    }));
    return result;
  }, [data]);

  // 周期选项
  const periodOptions = [
    { label: '日K', value: 'day' as PeriodType },
    { label: '周K', value: 'week' as PeriodType },
    { label: '月K', value: 'month' as PeriodType },
  ];

  // 指标选项
  const indicatorOptions = [
    { label: '无指标', value: 'none' as IndicatorType },
    { label: 'MA均线', value: 'MA' as IndicatorType },
    { label: 'MACD', value: 'MACD' as IndicatorType },
    { label: 'KDJ', value: 'KDJ' as IndicatorType },
    { label: 'RSI', value: 'RSI' as IndicatorType },
  ];

  // 处理周期切换
  const handlePeriodChange = (newPeriod: PeriodType) => {
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  // 处理指标切换
  const handleIndicatorChange = (newIndicator: IndicatorType) => {
    setIndicator(newIndicator);
    if (onIndicatorChange) {
      onIndicatorChange(newIndicator);
    }
  };

  // K线图配置
  const stockConfig = {
    data: chartData,
    xField: 'date',
    yField: ['open', 'close', 'low', 'high'],
    meta: {
      date: {
        type: 'cat',
      },
    },
    tooltip: {
      crosshairs: {
        type: 'xy',
      },
      formatter: (datum: any) => {
        return {
          name: datum.date,
          value: `开: ${datum.open} 收: ${datum.close} 低: ${datum.low} 高: ${datum.high}`,
        };
      },
    },
    slider: {
      start: 0.5,
      end: 1,
    },
    interactions: [
      {
        type: 'tooltip',
      },
      {
        type: 'crosshair',
      },
      {
        type: 'brush-x',
      },
    ],
  };

  // 成交量图配置
  const volumeConfig = {
    data: chartData,
    xField: 'date',
    yField: 'volume',
    meta: {
      date: {
        type: 'cat',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.date,
          value: `成交量: ${datum.volume}`,
        };
      },
    },
  };

  return (
    <Card
      title={
        <div className="kline-header">
          <span className="symbol-name">{symbol}</span>
          <Space size="middle">
            <Radio.Group
              options={periodOptions}
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              buttonStyle="solid"
            />
            <Select
              value={indicator}
              onChange={handleIndicatorChange}
              options={indicatorOptions}
              style={{ width: 120 }}
            />
          </Space>
        </div>
      }
      extra={
        <Space>
          <Button type="text" icon={<ReloadOutlined />} onClick={() => {}}>
            刷新
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        {data.length === 0 ? (
          <Empty description="暂无数据" style={{ padding: '50px 0' }} />
        ) : (
          <>
            <div style={{ height: `${height}px` }}>
              <Stock {...stockConfig} />
            </div>
            {showVolume && (
              <div style={{ height: '150px', marginTop: '20px' }}>
                <Stock {...volumeConfig} />
              </div>
            )}
          </>
        )}
      </Spin>
    </Card>
  );
};

export default KLineChart;