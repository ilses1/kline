import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isBetween from 'dayjs/plugin/isBetween';

// 扩展 dayjs 插件
dayjs.extend(weekday);
dayjs.extend(isBetween);

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 获取当前日期
 * @returns 当前日期字符串
 */
export const getCurrentDate = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * 获取当前日期时间
 * @returns 当前日期时间字符串
 */
export const getCurrentDateTime = (): string => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 获取相对时间
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串
 */
export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * 时间戳转日期
 * @param timestamp 时间戳（秒或毫秒）
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const timestampToDate = (timestamp: number, format = 'YYYY-MM-DD'): string => {
  // 判断是秒还是毫秒
  const isSeconds = timestamp < 10000000000;
  return dayjs(isSeconds ? timestamp * 1000 : timestamp).format(format);
};

/**
 * 时间戳转日期时间
 * @param timestamp 时间戳（秒或毫秒）
 * @returns 格式化后的日期时间字符串
 */
export const timestampToDateTime = (timestamp: number): string => {
  const isSeconds = timestamp < 10000000000;
  return dayjs(isSeconds ? timestamp * 1000 : timestamp).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 日期转时间戳（毫秒）
 * @param date 日期字符串或Date对象
 * @returns 时间戳（毫秒）
 */
export const dateToTimestamp = (date: string | Date): number => {
  return dayjs(date).valueOf();
};

/**
 * 日期转时间戳（秒）
 * @param date 日期字符串或Date对象
 * @returns 时间戳（秒）
 */
export const dateToTimestampSeconds = (date: string | Date): number => {
  return dayjs(date).unix();
};

/**
 * 判断是否为交易日（排除周末）
 * @param date 日期字符串或Date对象
 * @returns 是否为交易日
 */
export const isTradingDay = (date: string | Date): boolean => {
  const day = dayjs(date);
  const dayOfWeek = day.day();
  // 0是周日，6是周六，交易日是1-5（周一到周五）
  return dayOfWeek >= 1 && dayOfWeek <= 5;
};

/**
 * 判断是否为工作日（排除周末和节假日）
 * @param date 日期字符串或Date对象
 * @param holidays 节假日列表（可选）
 * @returns 是否为工作日
 */
export const isWorkDay = (date: string | Date, holidays: string[] = []): boolean => {
  const dateStr = formatDate(date);
  // 排除节假日
  if (holidays.includes(dateStr)) {
    return false;
  }
  return isTradingDay(date);
};

/**
 * 获取下一个交易日
 * @param date 日期字符串或Date对象
 * @param holidays 节假日列表（可选）
 * @returns 下一个交易日
 */
export const getNextTradingDay = (date: string | Date, holidays: string[] = []): string => {
  let current = dayjs(date).add(1, 'day');
  while (!isWorkDay(current, holidays)) {
    current = current.add(1, 'day');
  }
  return current.format('YYYY-MM-DD');
};

/**
 * 获取上一个交易日
 * @param date 日期字符串或Date对象
 * @param holidays 节假日列表（可选）
 * @returns 上一个交易日
 */
export const getPreviousTradingDay = (date: string | Date, holidays: string[] = []): string => {
  let current = dayjs(date).subtract(1, 'day');
  while (!isWorkDay(current, holidays)) {
    current = current.subtract(1, 'day');
  }
  return current.format('YYYY-MM-DD');
};

/**
 * 获取指定日期范围内的所有交易日
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param holidays 节假日列表（可选）
 * @returns 交易日数组
 */
export const getTradingDaysInRange = (
  startDate: string | Date,
  endDate: string | Date,
  holidays: string[] = []
): string[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const tradingDays: string[] = [];
  
  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    if (isWorkDay(current, holidays)) {
      tradingDays.push(current.format('YYYY-MM-DD'));
    }
    current = current.add(1, 'day');
  }
  
  return tradingDays;
};

/**
 * 计算两个日期之间的交易日数量
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param holidays 节假日列表（可选）
 * @returns 交易日数量
 */
export const countTradingDays = (
  startDate: string | Date,
  endDate: string | Date,
  holidays: string[] = []
): number => {
  return getTradingDaysInRange(startDate, endDate, holidays).length;
};

/**
 * 生成日期范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 日期数组
 */
export const generateDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  format = 'YYYY-MM-DD'
): string[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dates: string[] = [];
  
  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push(current.format(format));
    current = current.add(1, 'day');
  }
  
  return dates;
};

/**
 * 生成最近N天的日期范围
 * @param days 天数
 * @param endDate 结束日期（默认为今天）
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 日期数组
 */
export const generateRecentDays = (
  days: number,
  endDate: string | Date = new Date(),
  format = 'YYYY-MM-DD'
): string[] => {
  const end = dayjs(endDate);
  const start = end.subtract(days - 1, 'day');
  return generateDateRange(start, end, format);
};

/**
 * 生成最近N个交易日
 * @param days 交易日数量
 * @param endDate 结束日期（默认为今天）
 * @param holidays 节假日列表（可选）
 * @returns 交易日数组
 */
export const generateRecentTradingDays = (
  days: number,
  endDate: string | Date = new Date(),
  holidays: string[] = []
): string[] => {
  const tradingDays: string[] = [];
  let current = dayjs(endDate);
  
  while (tradingDays.length < days) {
    if (isWorkDay(current, holidays)) {
      tradingDays.unshift(current.format('YYYY-MM-DD'));
    }
    current = current.subtract(1, 'day');
  }
  
  return tradingDays;
};

/**
 * 获取指定日期的周范围（周一到周日）
 * @param date 日期
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns [开始日期, 结束日期]
 */
export const getWeekRange = (
  date: string | Date,
  format = 'YYYY-MM-DD'
): [string, string] => {
  const d = dayjs(date);
  const start = d.weekday(0); // 周一
  const end = d.weekday(6); // 周日
  return [start.format(format), end.format(format)];
};

/**
 * 获取指定日期的月范围（月初到月末）
 * @param date 日期
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns [开始日期, 结束日期]
 */
export const getMonthRange = (
  date: string | Date,
  format = 'YYYY-MM-DD'
): [string, string] => {
  const d = dayjs(date);
  const start = d.startOf('month');
  const end = d.endOf('month');
  return [start.format(format), end.format(format)];
};

/**
 * 获取指定日期的季度范围
 * @param date 日期
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns [开始日期, 结束日期]
 */
export const getQuarterRange = (
  date: string | Date,
  format = 'YYYY-MM-DD'
): [string, string] => {
  const d = dayjs(date);
  const start = d.startOf('quarter');
  const end = d.endOf('quarter');
  return [start.format(format), end.format(format)];
};

/**
 * 获取指定日期的年范围
 * @param date 日期
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns [开始日期, 结束日期]
 */
export const getYearRange = (
  date: string | Date,
  format = 'YYYY-MM-DD'
): [string, string] => {
  const d = dayjs(date);
  const start = d.startOf('year');
  const end = d.endOf('year');
  return [start.format(format), end.format(format)];
};

/**
 * 比较两个日期
 * @param date1 日期1
 * @param date2 日期2
 * @returns -1: date1 < date2, 0: date1 = date2, 1: date1 > date2
 */
export const compareDates = (date1: string | Date, date2: string | Date): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  if (d1.isBefore(d2)) return -1;
  if (d1.isAfter(d2)) return 1;
  return 0;
};

/**
 * 判断日期是否在范围内
 * @param date 要判断的日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 是否在范围内
 */
export const isDateInRange = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  return dayjs(date).isBetween(startDate, endDate, 'day', '[]');
};

/**
 * 计算日期差（天数）
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数差
 */
export const dateDiff = (startDate: string | Date, endDate: string | Date): number => {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
};

/**
 * 添加天数
 * @param date 日期
 * @param days 天数
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 新日期
 */
export const addDays = (date: string | Date, days: number, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).add(days, 'day').format(format);
};

/**
 * 添加月数
 * @param date 日期
 * @param months 月数
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 新日期
 */
export const addMonths = (date: string | Date, months: number, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).add(months, 'month').format(format);
};

/**
 * 添加年数
 * @param date 日期
 * @param years 年数
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 新日期
 */
export const addYears = (date: string | Date, years: number, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).add(years, 'year').format(format);
};