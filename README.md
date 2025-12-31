# KLine Chart - 加密货币K线图应用

一个基于 React + TypeScript + Vite 构建的加密货币K线图应用，提供实时行情数据展示和交互式K线图表分析功能。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v7
- **UI组件库**: Ant Design v6
- **图标**: Ant Design Icons
- **样式**: Tailwind CSS + PostCSS + Autoprefixer
- **图表库**: klinecharts v9.8.12
- **HTTP客户端**: Axios
- **日期处理**: dayjs
- **代码质量**: ESLint

## 项目功能

- 📊 实时K线图展示
- 🔄 多市场切换（BTC/USDT, ETH/USDT等）
- 🎨 支持明暗主题切换
- ⏱️ 多种时间周期选择（日K、周K、月K）
- 📈 技术指标展示（无指标、MA均线、MACD、KDJ、RSI）
- 💡 响应式设计，适配多种屏幕尺寸
- 🔄 数据刷新功能
- 🌐 真实市场数据集成（东方财富API）

## 安装和运行

### 前置要求

- Node.js 18+ 或 Bun
- pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist` 目录

### 代码检查

```bash
pnpm lint
```

### 预览生产构建

```bash
pnpm preview
```

## 项目结构

```
├── src/
│   ├── api/              # API请求和模拟数据
│   │   ├── index.ts      # API入口
│   │   ├── marketApi.ts  # 市场数据API
│   │   └── mock.ts       # 模拟数据生成
│   ├── assets/           # 静态资源
│   ├── components/       # 通用组件
│   │   ├── KLineChart/   # K线图核心组件
│   │   │   ├── KLineChart.tsx  # K线图实现
│   │   │   ├── types.ts        # 类型定义
│   │   │   └── KLineChart.css  # 样式
│   │   ├── MarketSelector/ # 市场选择器
│   │   └── ThemeToggle/  # 主题切换组件
│   ├── pages/            # 页面组件
│   │   ├── Home/         # 首页
│   │   └── MarketDetail/ # 市场详情页
│   ├── types/            # TypeScript类型定义
│   │   └── market.ts     # 市场数据类型
│   └── utils/            # 工具函数
│       └── date.ts       # 日期处理工具
├── public/               # 公共资源
├── .env                  # 环境变量配置
├── .gitignore            # Git忽略文件
├── eslint.config.js      # ESLint配置
├── package.json          # 项目配置和依赖
├── postcss.config.js     # PostCSS配置
├── tailwind.config.js    # Tailwind CSS配置
├── tsconfig.json         # TypeScript配置
└── vite.config.ts        # Vite配置
```

## 核心功能说明

### K线图组件（KLineChart）

KLineChart 是应用的核心组件，基于 klinecharts 库实现，提供以下功能：

#### 数据结构

单根K线数据包含以下字段：

```typescript
interface KLineData {
  date: string;        // 日期字符串
  open: number;        // 开盘价
  close: number;       // 收盘价
  high: number;        // 最高价
  low: number;         // 最低价
  volume: number;      // 成交量
}
```

#### 支持的周期

- **日K线** (day)
- **周K线** (week)
- **月K线** (month)

#### 支持的技术指标

- **无指标** (none)
- **MA均线** (MA)
- **MACD** (MACD)
- **KDJ** (KDJ)
- **RSI** (RSI)

### API集成

项目集成了东方财富API，通过Vite代理配置访问真实的市场数据。代理配置位于 `vite.config.ts` 中：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://push2his.eastmoney.com',
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
      headers: {
        'Referer': 'https://push2his.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    }
  }
}
```

#### 主要API接口

- `GET /api/markets` - 获取市场列表
- `GET /api/market/:symbol` - 获取单个市场详情
- `GET /api/kline/:symbol/:period` - 获取K线数据
- `GET /api/indicators/:symbol/:period` - 获取技术指标数据

## 组件说明

### KLineChart

核心K线图组件，支持多种时间周期和技术指标展示，提供交互式操作。

**Props**:

```typescript
interface KLineChartProps {
  data: KLineData[];                     // K线数据
  symbol: string;                        // 交易对符号
  period: PeriodType;                    // 时间周期
  loading?: boolean;                     // 加载状态
  height?: number;                       // 图表高度
  onPeriodChange?: (period: PeriodType) => void;  // 周期切换回调
  onIndicatorChange?: (indicator: IndicatorType) => void;  // 指标切换回调
}
```

### MarketSelector

市场选择器，允许用户在不同加密货币对之间切换。

### ThemeToggle

主题切换组件，支持明暗主题切换。

## 环境配置

项目使用 `.env` 文件管理环境变量，主要配置项：

- `VITE_API_URL` - API基础URL
- `VITE_WS_URL` - WebSocket连接URL（用于实时数据）

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用函数式组件和 Hooks

### 提交规范

遵循 Conventional Commits 规范，提交信息格式：

```
type(scope?): subject
```

常见 type 包括：feat, fix, docs, style, refactor, test, chore

## 构建和部署

### 构建配置

项目使用 Vite 构建，构建配置位于 `vite.config.ts` 中，包括：

- 代码分割优化
- 代理配置
- 构建输出目录设置

### 部署

项目已配置 Vercel 部署，推送代码到 main 分支即可自动部署。

### 部署要求

- 环境变量配置（VITE_API_URL, VITE_WS_URL）
- 支持 Node.js 18+ 的部署环境

## 许可证

MIT License

