import request from './index';
import type {
  KLineData,
  MarketInfo,
  MarketDetail,
  IndicatorData,
  PeriodType,
  IndicatorType,
  RealtimeQuote,
  MarketOverview,
} from '@/types/market';

/**
 * 转换周期类型到东方财富API的周期代码
 */
const periodToApiCode = (period: PeriodType): number => {
  const periodMap: Record<PeriodType, number> = {
    day: 101,
    week: 102,
    month: 103,
    minute: 1,
    hour: 5,
  };
  return periodMap[period] || 101;
};

/**
 * 转换股票代码到东方财富API的格式
 * 例如：000300.SH -> 1.000300, 399001.SZ -> 0.399001
 */
const symbolToSecid = (symbol: string): string => {
  if (symbol.includes('.')) {
    const [code, market] = symbol.split('.');
    if (market === 'SH') {
      return `1.${code}`;
    } else if (market === 'SZ') {
      return `0.${code}`;
    }
  }
  return symbol;
};

/**
 * 生成模拟K线数据
 */
const generateMockKLineData = (
  _symbol: string,
  period: PeriodType,
  count: number = 100
): KLineData[] => {
  const data: KLineData[] = [];
  const basePrice = 3000 + Math.random() * 2000;
  let currentPrice = basePrice;

  for (let i = 0; i < count; i++) {
    const date = new Date();
    
    // 根据周期调整日期
    switch (period) {
      case 'day':
        date.setDate(date.getDate() - (count - i));
        break;
      case 'week':
        date.setDate(date.getDate() - (count - i) * 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - (count - i));
        break;
      case 'minute':
        date.setMinutes(date.getMinutes() - (count - i));
        break;
      case 'hour':
        date.setHours(date.getHours() - (count - i));
        break;
    }
    
    const dateStr = date.toISOString().split('T')[0];

    const change = (Math.random() - 0.5) * (basePrice * 0.03);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
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

/**
 * 生成模拟技术指标数据
 */
const generateMockIndicatorData = (
  _symbol: string,
  _period: PeriodType,
  indicatorType: IndicatorType,
  count: number = 100
): IndicatorData[] => {
  const data: IndicatorData[] = [];

  for (let i = 0; i < count; i++) {
    const item: IndicatorData = {};

    if (indicatorType === 'MA' || indicatorType === 'none') {
      item.ma5 = 3000 + Math.random() * 500;
      item.ma10 = 2950 + Math.random() * 500;
      item.ma20 = 2900 + Math.random() * 500;
      item.ma30 = 2850 + Math.random() * 500;
    }

    if (indicatorType === 'MACD' || indicatorType === 'none') {
      item.dif = (Math.random() - 0.5) * 100;
      item.dea = (Math.random() - 0.5) * 100;
      item.macd = (Math.random() - 0.5) * 200;
    }

    if (indicatorType === 'KDJ' || indicatorType === 'none') {
      item.k = Math.random() * 100;
      item.d = Math.random() * 100;
      item.j = Math.random() * 100;
    }

    if (indicatorType === 'RSI' || indicatorType === 'none') {
      item.rsi = Math.random() * 100;
    }

    if (indicatorType === 'BOLL' || indicatorType === 'none') {
      const middle = 3000 + Math.random() * 500;
      item.upper = middle + 100 + Math.random() * 50;
      item.middle = middle;
      item.lower = middle - 100 - Math.random() * 50;
    }

    data.push(item);
  }

  return data;
};

/**
 * 计算默认日期范围
 * @param period 时间周期
 * @returns 默认开始日期
 */
const getDefaultStartDate = (period: PeriodType): string => {
  const date = new Date();
  
  // 对于所有周期，都返回一个非常早的日期，确保获取完整的历史数据
  // 对于分钟和小时K线，仍然限制为当天/近一周，避免数据量过大
  switch (period) {
    case 'minute':
      // 分钟K默认当天
      date.setHours(0, 0, 0, 0);
      break;
    case 'hour':
      // 小时K默认近一周
      date.setDate(date.getDate() - 7);
      break;
    default:
      // 其他周期返回20年前的日期，确保获取完整历史数据
      date.setFullYear(date.getFullYear() - 20);
  }
  
  return date.toISOString().split('T')[0];
};

/**
 * 获取K线数据
 * @param symbol 股票代码（格式：000300.SH 或 399001.SZ）
 * @param period 时间周期
 * @param startDate 开始日期（可选，格式：YYYY-MM-DD，不传则根据周期类型使用默认值）
 * @param endDate 结束日期（可选，格式：YYYY-MM-DD，不传则使用今天）
 * @param count 数据条数（默认1000，增加默认值确保获取足够的历史数据）
 */
export const getKLineData = async (
  symbol: string,
  period: PeriodType = 'day',
  startDate?: string,
  endDate?: string,
  count: number = 1000
): Promise<KLineData[]> => {
  try {
    const secid = symbolToSecid(symbol);
    const periodCode = periodToApiCode(period);

    // 格式化日期为YYYYMMDD格式
    const formatDate = (dateStr: string): string => {
      return dateStr.replace(/-/g, '');
    };

    // 如果没有指定开始日期，使用默认值
    const defaultStartDate = startDate || getDefaultStartDate(period);
    // 如果没有指定结束日期，使用今天
    const defaultEndDate = endDate || new Date().toISOString().split('T')[0];

    const response = await request.get('/stock/kline/get', {
      params: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        klt: periodCode,
        fqt: 1, // 前复权
        beg: formatDate(defaultStartDate),
        end: formatDate(defaultEndDate),
        lmt: count,
      },
    });

    console.log('API Response:', response);
    console.log('Response:', response);

    // 解析东方财富API返回的数据格式
    // klines格式: 日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率
    // 响应拦截器返回的是response.data.data，可能是一个包含klines属性的对象
    if (response && typeof response === 'object' && 'klines' in response) {
      const responseWithKlines = response as { klines: string[] };
      if (responseWithKlines.klines && responseWithKlines.klines.length > 0) {
        console.log('解析K线数据，数量:', responseWithKlines.klines.length);
        const parsedData = responseWithKlines.klines.map((item: string) => {
          const [date, open, close, high, low, volume] = item.split(',');
          return {
            date,
            open: parseFloat(open),
            close: parseFloat(close),
            high: parseFloat(high),
            low: parseFloat(low),
            volume: parseFloat(volume),
          };
        });
        console.log('解析后的数据:', parsedData.slice(0, 3));
        return parsedData;
      }
    }
    // 也可能直接返回klines数组
    if (Array.isArray(response) && response.length > 0) {
      console.log('解析K线数据，数量:', response.length);
      const parsedData = response.map((item: string) => {
        const [date, open, close, high, low, volume] = item.split(',');
        return {
          date,
          open: parseFloat(open),
          close: parseFloat(close),
          high: parseFloat(high),
          low: parseFloat(low),
          volume: parseFloat(volume),
        };
      });
      console.log('解析后的数据:', parsedData.slice(0, 3));
      return parsedData;
    }

    // 如果API返回空数据，使用模拟数据
    console.warn('API返回空数据，使用模拟数据');
    return generateMockKLineData(symbol, period, count);
  } catch (error) {
    console.error('获取K线数据失败，使用模拟数据:', error);
    return generateMockKLineData(symbol, period, count);
  }
};

/**
 * 获取市场列表
 * @param category 分类（可选）
 * @param page 页码（默认1）
 * @param pageSize 每页数量（默认20）
 */
export const getMarketList = async (
  category?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<MarketInfo[]> => {
  try {
    // 预置市场列表
    const markets: MarketInfo[] = [
      // 主要指数
      { symbol: '000001.SH', name: '上证指数', price: 3245.67, change: 39.87, changePercent: 1.25 },
      { symbol: '399001.SZ', name: '深证成指', price: 10876.54, change: 94.23, changePercent: 0.87 },
      { symbol: '399006.SZ', name: '创业板指', price: 2345.89, change: -10.56, changePercent: -0.45 },
      { symbol: '000300.SH', name: '沪深300', price: 3876.45, change: 48.32, changePercent: 1.26 },
      { symbol: '000905.SH', name: '中证500', price: 5234.67, change: 23.45, changePercent: 0.45 },
      { symbol: '000852.SH', name: '中证1000', price: 6123.89, change: -12.34, changePercent: -0.20 },
      
      // 热门股票
      { symbol: '600519.SH', name: '贵州茅台', price: 1789.50, change: 15.30, changePercent: 0.86 },
      { symbol: '000858.SZ', name: '五粮液', price: 156.78, change: 2.34, changePercent: 1.52 },
      { symbol: '601318.SH', name: '中国平安', price: 45.67, change: -0.45, changePercent: -0.98 },
      { symbol: '300750.SZ', name: '宁德时代', price: 189.23, change: 5.67, changePercent: 3.09 },
      { symbol: '600036.SH', name: '招商银行', price: 32.45, change: 0.56, changePercent: 1.76 },
      { symbol: '000001.SZ', name: '平安银行', price: 12.34, change: 0.12, changePercent: 0.98 },
      { symbol: '600036.SH', name: '中国中免', price: 145.67, change: -3.21, changePercent: -2.16 },
      { symbol: '600276.SH', name: '恒瑞医药', price: 45.89, change: 1.23, changePercent: 2.75 },
      { symbol: '002594.SZ', name: '比亚迪', price: 234.56, change: 8.90, changePercent: 3.95 },
    ];

    // 如果指定了分类，可以进行过滤
    let filteredMarkets = markets;
    if (category) {
      // 这里可以根据实际需求实现分类过滤逻辑
      filteredMarkets = markets.filter(m => m.name.includes(category));
    }

    // 分页处理
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredMarkets.slice(start, end);
  } catch (error) {
    console.error('获取市场列表失败:', error);
    return [];
  }
};

/**
 * 获取实时行情
 * @param symbols 股票代码数组（支持单个或多个）
 */
export const getRealTimeQuote = async (
  symbols: string | string[]
): Promise<RealtimeQuote[]> => {
  try {
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
    const results: RealtimeQuote[] = [];

    for (const symbol of symbolArray) {
      const secid = symbolToSecid(symbol);

      const response = await request.get('/stock/get', {
        params: {
          secid,
          fields: 'f43,f44,f45,f46,f47,f48,f49,f50,f51,f52,f57,f58,f60,f107,f116,f117,f161,f162,f163,f164,f165,f169,f170',
          fltt: 2,
        },
      });

      // 响应拦截器已经返回了response.data.data，所以直接使用response
      if (response && response.diff && response.diff.length > 0) {
        const data = response.diff[0];
        results.push({
          symbol,
          name: data.f58 || '',
          price: data.f43 || 0,
          change: data.f169 || 0,
          changePercent: data.f170 || 0,
          volume: data.f47 || 0,
          amount: data.f48 || 0,
          bidPrice: data.f44 || 0,
          askPrice: data.f45 || 0,
          bidVolume: data.f49 || 0,
          askVolume: data.f50 || 0,
          high: data.f51 || 0,
          low: data.f52 || 0,
          open: data.f57 || 0,
          preClose: data.f60 || 0,
          updateTime: new Date().toISOString(),
        });
      }
    }

    return results;
  } catch (error) {
    console.error('获取实时行情失败，使用模拟数据:', error);
    
    // 返回模拟数据
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
    return symbolArray.map(symbol => ({
      symbol,
      name: symbol.split('.')[0],
      price: 3000 + Math.random() * 2000,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000000) + 500000000,
      amount: Math.floor(Math.random() * 10000000000) + 5000000000,
      bidPrice: 3000 + Math.random() * 2000,
      askPrice: 3000 + Math.random() * 2000,
      bidVolume: Math.floor(Math.random() * 1000000) + 500000,
      askVolume: Math.floor(Math.random() * 1000000) + 500000,
      high: 3000 + Math.random() * 2000,
      low: 3000 + Math.random() * 2000,
      open: 3000 + Math.random() * 2000,
      preClose: 3000 + Math.random() * 2000,
      updateTime: new Date().toISOString(),
    }));
  }
};

/**
 * 获取技术指标
 * @param symbol 股票代码
 * @param period 时间周期
 * @param indicatorType 指标类型
 * @param count 数据条数（默认100）
 */
export const getMarketIndicators = async (
  symbol: string,
  period: PeriodType = 'day',
  indicatorType: IndicatorType = 'MA',
  count: number = 100
): Promise<IndicatorData[]> => {
  try {
    // 目前东方财富API不直接提供技术指标数据
    // 这里使用模拟数据，实际项目中可以：
    // 1. 使用第三方技术指标库计算
    // 2. 调用其他提供技术指标的API
    // 3. 在前端基于K线数据计算
    
    console.log(`获取 ${symbol} 的 ${indicatorType} 指标数据`);
    return generateMockIndicatorData(symbol, period, indicatorType, count);
  } catch (error) {
    console.error('获取技术指标失败:', error);
    return generateMockIndicatorData(symbol, period, indicatorType, count);
  }
};

/**
 * 获取市场详情
 * @param symbol 市场代码
 * @param period 时间周期
 */
export const getMarketDetail = async (
  symbol: string,
  period: PeriodType = 'day'
): Promise<MarketDetail> => {
  try {
    const [quotes, klineData] = await Promise.all([
      getRealTimeQuote(symbol),
      getKLineData(symbol, period),
    ]);

    const quote = quotes[0];
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      klineData,
    };
  } catch (error) {
    console.error('获取市场详情失败:', error);
    throw error;
  }
};

/**
 * 获取市场概况
 * @param symbol 股票代码
 */
export const getMarketOverview = async (symbol: string): Promise<MarketOverview> => {
  try {
    const quotes = await getRealTimeQuote(symbol);
    const quote = quotes[0];

    return {
      symbol: quote.symbol,
      name: quote.name,
      changePercent: quote.changePercent,
      volume: quote.volume,
      turnover: quote.amount,
      pe: 12.5 + Math.random() * 10,
      pb: 1.5 + Math.random() * 2,
      marketCap: quote.price * 1000000000 + Math.random() * 5000000000,
      circulatingMarketCap: quote.price * 800000000 + Math.random() * 4000000000,
    };
  } catch (error) {
    console.error('获取市场概况失败:', error);
    throw error;
  }
};

/**
 * 搜索股票
 * @param keyword 搜索关键词
 */
export const searchStock = async (keyword: string): Promise<MarketInfo[]> => {
  try {
    const response = await request.get('/stock/suggest/get', {
      params: {
        input: keyword,
        type: '14',
        token: 'd4d3d7e8a8c74b1a9b3e4f5a6b7c8d9e',
      },
    });

    // 响应拦截器已经返回了response.data.data，所以直接使用response
    if (response && response.suggestions && Array.isArray(response.suggestions)) {
      return response.suggestions.map((item: any) => ({
        symbol: item.code || '',
        name: item.name || '',
        price: 0,
        change: 0,
        changePercent: 0,
      }));
    }

    return [];
  } catch (error) {
    console.error('搜索股票失败:', error);
    return [];
  }
};

/**
 * 批量获取K线数据（支持多个股票）
 * @param symbols 股票代码数组
 * @param period 时间周期
 */
export const batchGetKLineData = async (
  symbols: string[],
  period: PeriodType = 'day'
): Promise<Record<string, KLineData[]>> => {
  const results: Record<string, KLineData[]> = {};

  const promises = symbols.map(async (symbol) => {
    try {
      const data = await getKLineData(symbol, period);
      results[symbol] = data;
    } catch (error) {
      console.error(`获取 ${symbol} K线数据失败:`, error);
      results[symbol] = [];
    }
  });

  await Promise.all(promises);
  return results;
};


