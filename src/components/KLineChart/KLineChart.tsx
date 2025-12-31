import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Spin, Empty, Radio, Select, Button } from 'antd';
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
  // 定义chart实例的接口，包含resize方法
  interface ChartInstance {
    resize: () => void;
    applyNewData: (data: KLineChartLibData[]) => void;
    createIndicator: (type: IndicatorType) => void;
  }
  const chartInstanceRef = useRef<ChartInstance | null>(null);

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
    const currentChartRef = chartRef.current;
    if (currentChartRef) {
      dispose(currentChartRef as HTMLElement);
      
      // v9版本：不设置height，通过CSS控制
      const newChart = init(currentChartRef);
      
      if (newChart) {
        // 类型断言，确保newChart具有所需的方法
        const typedChart = newChart as ChartInstance;
        chartInstanceRef.current = typedChart;
        
        // 设置数据
        typedChart.applyNewData(chartData);
        
        // 添加指标
        if (newIndicator !== 'none') {
          typedChart.createIndicator(newIndicator);
        }
      }
    }
  };

  // 初始化和更新图表
  useEffect(() => {
    const currentChartRef = chartRef.current;
    if (!currentChartRef) return;

    // 如果图表实例已存在，销毁并重新创建
    if (chartInstanceRef.current) {
      dispose(currentChartRef as HTMLElement);
    }

    // 创建图表实例 - v9版本：使用默认配置，通过CSS控制高度
    const chart = init(currentChartRef);

    if (!chart) return;

    // 类型断言，确保chart具有所需的方法
    const typedChart = chart as ChartInstance;
    chartInstanceRef.current = typedChart;

    // 设置数据
    typedChart.applyNewData(chartData);

    // 添加初始指标
    if (indicator !== 'none') {
      typedChart.createIndicator(indicator);
    }

    // 添加ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    });

    // 监听图表容器
    resizeObserver.observe(currentChartRef);

    // 清理函数
    return () => {
      resizeObserver.disconnect();
      dispose(currentChartRef as HTMLElement);
      chartInstanceRef.current = null;
    };
  }, [chartData, indicator]);

  // 适配移动端：窗口大小变化时重新调整图表
  useEffect(() => {
    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card
      className="kline-chart-card"
      title={
        <div className="kline-chart-header">
          <h2 className="kline-chart-title">{symbol}</h2>
          <div className="kline-chart-actions">
            <div className="kline-chart-toolbar">
              <div className="kline-chart-toolbar-group">
                <span className="kline-chart-toolbar-label">周期:</span>
                <Radio.Group
                  options={periodOptions}
                  value={period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  buttonStyle="solid"
                  className="kline-period-selector"
                />
              </div>
              <div className="kline-chart-toolbar-group">
                <span className="kline-chart-toolbar-label">指标:</span>
                <Select
                  value={indicator}
                  onChange={handleIndicatorChange}
                  options={indicatorOptions}
                  className="kline-indicator-selector"
                  style={{ width: window.innerWidth < 768 ? 100 : 140 }}
                />
              </div>
            </div>
            <Button type="text" icon={<ReloadOutlined />} onClick={() => {}} className="kline-refresh-button">
              刷新
            </Button>
          </div>
        </div>
      }
      bodyStyle={{ padding: 0, height: '100%' }}
    >
      <div className="kline-chart-body">
        <Spin spinning={loading} className="kline-chart-loading">
          {data.length === 0 ? (
            <Empty description="暂无数据" className="kline-chart-empty" />
          ) : (
            <div ref={chartRef} className="kline-chart-container" style={{ width: '100%', height: '100%', minHeight: `${height + 150}px` }} />
          )}
        </Spin>
      </div>
    </Card>
  );
};

export default KLineChart;