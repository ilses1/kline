import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Spin, Empty, Radio, Select, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { init, dispose, type KLineData as KLineChartLibData } from 'klinecharts';
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
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // 转换数据格式为 klinecharts 需要的格式
  const chartData = useMemo(() => {
    const result: KLineChartLibData[] = data.map((item) => ({
      timestamp: new Date(item.date).getTime(),
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
    
    // 更新图表指标 - 这里需要重新创建图表，因为klinecharts API不支持动态切换指标
    if (chartRef.current) {
      dispose(chartRef.current as HTMLElement);
      
      // v9版本：不设置height，通过CSS控制
      const newChart = init(chartRef.current);
      
      if (newChart) {
        chartInstanceRef.current = newChart;
        
        // 设置数据
        newChart.applyNewData(chartData);
        
        // 添加指标
        if (newIndicator !== 'none') {
          newChart.createIndicator(newIndicator);
        }
      }
    }
  };

  // 初始化和更新图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 如果图表实例已存在，销毁并重新创建
    if (chartInstanceRef.current) {
      dispose(chartRef.current as HTMLElement);
    }

    // 创建图表实例 - v9版本：不设置height，通过CSS控制
    const chart = init(chartRef.current);

    if (!chart) return;

    chartInstanceRef.current = chart;

    // 设置数据
    chart.applyNewData(chartData);

    // 添加初始指标
    if (indicator !== 'none') {
      chart.createIndicator(indicator);
    }

    // 添加ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    });

    // 监听图表容器
    resizeObserver.observe(chartRef.current);

    // 清理函数
    return () => {
      resizeObserver.disconnect();
      dispose(chartRef.current as HTMLElement);
      chartInstanceRef.current = null;
    };
  }, [chartData, indicator]);

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
      bodyStyle={{ padding: 0, height: '100%' }}
    >
      <Spin spinning={loading}>
        {data.length === 0 ? (
          <Empty description="暂无数据" style={{ padding: '50px 0' }} />
        ) : (
          <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: `${height + 150}px` }} />
        )}
      </Spin>
    </Card>
  );
};

export default KLineChart;