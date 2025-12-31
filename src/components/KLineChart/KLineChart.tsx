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

  // 计算MA均线数据 - 暂时注释，因为未使用
  // const calculateMA = (data: any[], dayCount: number) => {
  //   const result: any[] = [];
  //   for (let i = 0; i < data.length; i++) {
  //     if (i < dayCount - 1) {
  //       result.push({
  //         date: data[i].date,
  //         value: null,
  //       });
  //       continue;
  //     }
  //     let sum = 0;
  //     for (let j = 0; j < dayCount; j++) {
  //       sum += data[i - j].close; // close price
  //     }
  //     result.push({
  //       date: data[i].date,
  //       value: sum / dayCount,
  //     });
  //   }
  //   return result;
  // };

  // 计算MACD指标 - 暂时注释，因为未使用
  // const calculateMACD = (data: any[]) => {
  //   const shortPeriod = 12;
  //   const longPeriod = 26;
  //   const signalPeriod = 9;
  //   
  //   const calculateEMA = (data: number[], period: number) => {
  //     const k = 2 / (period + 1);
  //     const ema = [data[0]];
  //     for (let i = 1; i < data.length; i++) {
  //       ema.push(data[i] * k + ema[i - 1] * (1 - k));
  //     }
  //     return ema;
  //   };

  //   const closePrices = data.map(d => d.close);
  //   const emaShort = calculateEMA(closePrices, shortPeriod);
  //   const emaLong = calculateEMA(closePrices, longPeriod);
  //   
  //   const dif = emaShort.map((v, i) => v - emaLong[i]);
  //   const dea = calculateEMA(dif, signalPeriod);
  //   const macd = dif.map((v, i) => (v - dea[i]) * 2);

  //   return data.map((d, i) => ({
  //     date: d.date,
  //     dif: dif[i],
  //     dea: dea[i],
  //     macd: macd[i],
  //   }));
  // };

  // 计算KDJ指标 - 暂时注释，因为未使用
  // const calculateKDJ = (data: any[]) => {
  //   const n = 9;
  //   const result: any[] = [];

  //   for (let i = 0; i < data.length; i++) {
  //     if (i < n - 1) {
  //       result.push({
  //         date: data[i].date,
  //         k: 50,
  //         d: 50,
  //         j: 50,
  //       });
  //       continue;
  //     }

  //     let high = -Infinity;
  //     let low = Infinity;
  //     for (let j = 0; j < n; j++) {
  //       high = Math.max(high, data[i - j].high); // high
  //       low = Math.min(low, data[i - j].low); // low
  //     }

  //     const rsv = ((data[i].close - low) / (high - low)) * 100;
  //     const prevK = result[i - 1].k;
  //     const prevD = result[i - 1].d;
  //     
  //     const k = (2 / 3) * prevK + (1 / 3) * rsv;
  //     const d = (2 / 3) * prevD + (1 / 3) * k;
  //     const j = 3 * k - 2 * d;

  //     result.push({
  //       date: data[i].date,
  //       k,
  //       d,
  //       j,
  //     });
  //   }

  //   return result;
  // };

  // 计算RSI指标 - 暂时注释，因为未使用
  // const calculateRSI = (data: any[]) => {
  //   const period = 14;
  //   const result: any[] = [];

  //   for (let i = 0; i < data.length; i++) {
  //     if (i < period) {
  //       result.push({
  //         date: data[i].date,
  //         rsi: 50,
  //       });
  //       continue;
  //     }

  //     let gains = 0;
  //     let losses = 0;

  //     for (let j = 0; j < period; j++) {
  //       const change = data[i - j].close - data[i - j - 1].close;
  //       if (change > 0) {
  //         gains += change;
  //       } else {
  //         losses -= change;
  //       }
  //     }

  //     const avgGain = gains / period;
  //     const avgLoss = losses / period;
  //     const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  //     const rsi = 100 - (100 / (1 + rs));

  //     result.push({
  //       date: data[i].date,
  //       rsi,
  //     });
  //   }

  //   return result;
  };

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
    console.log('K线图数据转换结果:', result.slice(0, 3));
    console.log('数据格式检查:', {
      hasDate: result[0]?.hasOwnProperty('date'),
      hasOpen: result[0]?.hasOwnProperty('open'),
      hasClose: result[0]?.hasOwnProperty('close'),
      hasLow: result[0]?.hasOwnProperty('low'),
      hasHigh: result[0]?.hasOwnProperty('high'),
      hasVolume: result[0]?.hasOwnProperty('volume'),
    });
    return result;
  }, [data]);

  // 计算指标数据 - 暂时注释，因为未使用
  // const indicatorData = useMemo(() => {
  //   if (indicator === 'MA') {
  //     return {
  //       ma5: calculateMA(chartData, 5),
  //       ma10: calculateMA(chartData, 10),
  //       ma20: calculateMA(chartData, 20),
  //       ma30: calculateMA(chartData, 30),
  //     };
  //   } else if (indicator === 'MACD') {
  //     return {
  //       macd: calculateMACD(chartData),
  //     };
  //   } else if (indicator === 'KDJ') {
  //     return {
  //       kdj: calculateKDJ(chartData),
  //     };
  //   } else if (indicator === 'RSI') {
  //     return {
  //       rsi: calculateRSI(chartData),
  //     };
  //   }
  //   return {};
  // }, [chartData, indicator]);

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
          name: '成交量',
          value: datum.volume,
        };
      },
    },
    interactions: [
      {
        type: 'tooltip',
      },
      {
        type: 'brush-x',
      },
    ],
  };

  if (loading) {
    return (
      <Card>
        <div style={{ height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div style={{ height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Empty description="暂无数据" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`${symbol} K线图`}
      extra={
        <Space>
          <Radio.Group
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            {periodOptions.map(option => (
              <Radio.Button key={option.value} value={option.value}>
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <Select
            value={indicator}
            onChange={handleIndicatorChange}
            style={{ width: 120 }}
            options={indicatorOptions}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <div style={{ height: `${height}px` }}>
        <Stock {...stockConfig} />
      </div>
      {showVolume && (
        <div style={{ height: '150px', marginTop: '20px' }}>
          <Stock {...volumeConfig} />
        </div>
      )}
    </Card>
  );
};

export default KLineChart;