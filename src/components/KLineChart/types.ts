import type { KLineData, PeriodType, IndicatorType } from '@/types/market';

export type { PeriodType, IndicatorType };

export interface KLineChartProps {
  data: KLineData[];
  symbol: string;
  period: PeriodType;
  loading?: boolean;
  height?: number;
  onPeriodChange?: (period: PeriodType) => void;
  onIndicatorChange?: (indicator: IndicatorType) => void;
  onDateChange?: (date: string) => void;
}