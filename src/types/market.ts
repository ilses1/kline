// 市场数据类型定义

/**
 * 单根K线数据结构
 */
export interface KLineData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

/**
 * 市场基本信息
 */
export interface MarketInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

/**
 * 市场详情（包含K线数据）
 */
export interface MarketDetail extends MarketInfo {
  klineData: KLineData[];
}

/**
 * 技术指标数据
 */
export interface IndicatorData {
  // MA均线指标
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma30?: number;
  
  // MACD指标
  dif?: number;
  dea?: number;
  macd?: number;
  
  // KDJ指标
  k?: number;
  d?: number;
  j?: number;
  
  // RSI指标
  rsi?: number;
  
  // BOLL指标
  upper?: number;
  middle?: number;
  lower?: number;
}

/**
 * 技术指标类型
 */
export type IndicatorType = 'none' | 'MA' | 'MACD' | 'KDJ' | 'RSI' | 'BOLL';

/**
 * 周期类型
 */
export type PeriodType = 'day' | 'week' | 'month' | 'minute' | 'hour';

/**
 * 通用API响应结构
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * K线数据API响应
 */
export interface KLineDataResponse {
  symbol: string;
  period: PeriodType;
  data: KLineData[];
  updateTime: string;
}

/**
 * 市场信息API响应
 */
export interface MarketInfoResponse extends MarketInfo {
  volume: number;
  turnover: number;
  high: number;
  low: number;
  amplitude: number;
  pe: number;
  pb: number;
  updateTime: string;
}

/**
 * 市场列表API响应
 */
export interface MarketListResponse {
  markets: MarketInfo[];
  total: number;
}

/**
 * 技术指标数据API响应
 */
export interface IndicatorDataResponse {
  symbol: string;
  period: PeriodType;
  indicatorType: IndicatorType;
  data: IndicatorData[];
  updateTime: string;
}

/**
 * 实时行情数据
 */
export interface RealtimeQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  bidPrice: number;
  askPrice: number;
  bidVolume: number;
  askVolume: number;
  high: number;
  low: number;
  open: number;
  preClose: number;
  updateTime: string;
}

/**
 * 市场概况数据
 */
export interface MarketOverview {
  symbol: string;
  name: string;
  changePercent: number;
  volume: number;
  turnover: number;
  pe: number;
  pb: number;
  marketCap: number;
  circulatingMarketCap: number;
}

/**
 * 搜索参数
 */
export interface SearchParams {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

/**
 * K线查询参数
 */
export interface KLineQueryParams {
  symbol: string;
  period: PeriodType;
  startDate?: string;
  endDate?: string;
  count?: number;
}