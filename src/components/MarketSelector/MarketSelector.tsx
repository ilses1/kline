import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import './MarketSelector.css';

// 市场选项类型
export interface MarketOption {
  label: string;
  value: string;
  category: string;
}

// 预置市场数据
const PRESET_MARKETS: MarketOption[] = [
  // 主要指数
  { label: '沪深300', value: '000300.SH', category: '主要指数' },
  { label: '上证指数', value: '000001.SH', category: '主要指数' },
  { label: '深证成指', value: '399001.SZ', category: '主要指数' },
  { label: '创业板指', value: '399006.SZ', category: '主要指数' },
  { label: '中证500', value: '000905.SH', category: '主要指数' },
  { label: '中证1000', value: '000852.SH', category: '主要指数' },
  
  // 行业板块
  { label: '银行', value: 'BK0001', category: '行业板块' },
  { label: '证券', value: 'BK0002', category: '行业板块' },
  { label: '保险', value: 'BK0003', category: '行业板块' },
  { label: '房地产', value: 'BK0004', category: '行业板块' },
  { label: '钢铁', value: 'BK0005', category: '行业板块' },
  { label: '煤炭', value: 'BK0006', category: '行业板块' },
  { label: '有色金属', value: 'BK0007', category: '行业板块' },
  { label: '石油石化', value: 'BK0008', category: '行业板块' },
  { label: '电力', value: 'BK0009', category: '行业板块' },
  { label: '汽车', value: 'BK0010', category: '行业板块' },
  
  // 概念板块
  { label: '人工智能', value: 'BK1001', category: '概念板块' },
  { label: '新能源', value: 'BK1002', category: '概念板块' },
  { label: '芯片半导体', value: 'BK1003', category: '概念板块' },
  { label: '5G概念', value: 'BK1004', category: '概念板块' },
  { label: '数字经济', value: 'BK1005', category: '概念板块' },
  { label: '元宇宙', value: 'BK1006', category: '概念板块' },
  { label: '碳中和', value: 'BK1007', category: '概念板块' },
  { label: '军工', value: 'BK1008', category: '概念板块' },
  { label: '生物医药', value: 'BK1009', category: '概念板块' },
  { label: '消费电子', value: 'BK1010', category: '概念板块' },
];

// 分类列表
const CATEGORIES = ['主要指数', '行业板块', '概念板块'];

// 防抖函数
function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  delay: number
): (...args: T) => void {
  const timerRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

interface MarketSelectorProps extends Omit<SelectProps<string>, 'options' | 'onChange'> {
  value?: string;
  onChange?: (value: string, option: MarketOption | undefined) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择市场',
  style,
  ...restProps
}) => {
  const [searchText, setSearchText] = useState('');

  // 防抖搜索处理
  const handleSearch = useDebounce((value: string) => {
    setSearchText(value);
  }, 300);

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchText) {
      return PRESET_MARKETS;
    }

    const lowerSearchText = searchText.toLowerCase();
    return PRESET_MARKETS.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerSearchText) ||
        option.value.toLowerCase().includes(lowerSearchText)
    );
  }, [searchText]);

  // 按分类分组选项
  const groupedOptions = useMemo(() => {
    const groups: Record<string, MarketOption[]> = {};
    
    CATEGORIES.forEach((category) => {
      groups[category] = filteredOptions.filter(
        (option) => option.category === category
      );
    });

    return groups;
  }, [filteredOptions]);

  // 生成 Select 的 options
  const selectOptions = useMemo(() => {
    const options: SelectProps['options'] = [];

    CATEGORIES.forEach((category) => {
      const groupOptions = groupedOptions[category];
      
      if (groupOptions.length > 0) {
        options.push({
          label: category,
          title: category,
          options: groupOptions.map((item) => ({
            label: item.label,
            value: item.value,
          })),
        });
      }
    });

    return options;
  }, [groupedOptions]);

  // 处理选择变化
  const handleChange = (selectedValue: string) => {
    const selectedOption = PRESET_MARKETS.find(
      (item) => item.value === selectedValue
    );
    onChange?.(selectedValue, selectedOption);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onSearch={handleSearch}
      filterOption={false}
      options={selectOptions}
      style={{ width: '100%', ...style }}
      {...restProps}
    />
  );
};

export default React.memo(MarketSelector);
