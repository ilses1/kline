# Tailwind CSS 配置文档

## 概述

本项目已成功配置 Tailwind CSS，包括响应式断点、暗色主题支持、全局样式和 K 线图自定义样式。

## 已完成的配置

### 1. 安装 Tailwind CSS

已安装以下依赖：
- `tailwindcss@4.1.18`
- `postcss@8.5.6`
- `autoprefixer@10.4.23`

### 2. 配置文件

#### 2.1 PostCSS 配置 (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### 2.2 Tailwind 配置 (`tailwind.config.js`)

**响应式断点：**
- `xs`: 480px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1920px

**K 线图颜色：**
- 涨：`#ef4444` (红色)
- 跌：`#22c55e` (绿色)

**主题颜色：**
- Primary: `#1890ff`
- Success: `#52c41a`
- Warning: `#faad14`
- Error: `#ff4d4f`
- Info: `#1890ff`

**暗色主题：**
- 背景：`#1f1f1f`
- 表面：`#262626`
- 边框：`#404040`
- 文本：`#e5e5e5`
- 次要文本：`#a3a3a3`

### 3. 全局样式 (`src/index.css`)

使用 Tailwind CSS 的 `@layer` 指令组织样式：

- **@layer base**: 基础样式（按钮、输入框、链接等）
- **@layer components**: 组件样式（市场卡片、K 线图容器等）
- **@layer utilities**: 工具类（文本省略、滚动条、玻璃态等）

**主要功能：**
- 暗色主题支持（通过 `dark:` 前缀）
- 响应式设计（通过断点前缀）
- 自定义滚动条样式
- 玻璃态效果
- 文本省略工具类
- 打印样式优化

### 4. K 线图自定义样式 (`src/components/KLineChart/KLineChart.css`)

**样式特性：**
- K 线图容器和卡片样式
- 头部和工具栏样式
- 周期选择器（日K、周K、月K）
- 指标选择器（MA、MACD、KDJ、RSI）
- 加载状态和空状态样式
- 工具提示样式
- 十字光标样式
- 滑块样式
- 响应式适配（移动端优化）
- 暗色主题适配
- 动画效果（淡入、脉冲）
- 骨架屏样式

### 5. 主题切换组件 (`src/components/ThemeToggle/index.tsx`)

**功能：**
- 从 localStorage 读取主题设置
- 监听系统暗色模式偏好
- 切换亮色/暗色主题
- 使用 Ant Design 的 MoonOutlined 和 SunOutlined 图标
- 应用 Tailwind CSS 类实现样式和过渡效果

## 使用方法

### 在组件中使用 Tailwind CSS

```tsx
import './index.css'; // 导入全局样式

function MyComponent() {
  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-lg">
      <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
        标题
      </h1>
      <p className="text-gray-600 dark:text-dark-textSecondary">
        内容
      </p>
    </div>
  );
}
```

### 使用主题切换

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function App() {
  return (
    <div>
      <ThemeToggle />
      {/* 其他内容 */}
    </div>
  );
}
```

### 使用 K 线图样式

```tsx
import KLineChart from '@/components/KLineChart/KLineChart';

function MarketDetail() {
  return (
    <div className="kline-chart-wrapper">
      <KLineChart
        data={klineData}
        symbol="AAPL"
        period="day"
        height={600}
      />
    </div>
  );
}
```

## 响应式设计示例

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 在小屏幕上 1 列，中等屏幕 2 列，大屏幕 3 列 */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* 字体大小随屏幕尺寸变化 */}
</div>
```

## 暗色主题支持

Tailwind CSS 自动支持暗色主题，只需在类名中添加 `dark:` 前缀：

```tsx
<div className="bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text">
  {/* 亮色主题：白色背景，深色文本 */}
  {/* 暗色主题：深色背景，浅色文本 */}
</div>
```

## 自定义配置

如需修改配置，请编辑以下文件：

1. **Tailwind 配置**: `tailwind.config.js`
2. **全局样式**: `src/index.css`
3. **K 线图样式**: `src/components/KLineChart/KLineChart.css`

## 注意事项

1. 确保 `src/index.css` 在入口文件（`src/main.tsx`）中导入
2. 使用 `dark:` 前缀时，确保父元素有 `dark` 类名（由 ThemeToggle 组件自动添加）
3. 响应式断点使用 `xs:`、`sm:`、`md:`、`lg:`、`xl:`、`2xl:`、`3xl:` 前缀
4. 自定义工具类可以在 `src/index.css` 的 `@layer utilities` 中添加

## 浏览器支持

Tailwind CSS 支持所有现代浏览器，包括：
- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Opera (最新版本)

## 相关资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS 暗色模式](https://tailwindcss.com/docs/dark-mode)
- [Tailwind CSS 响应式设计](https://tailwindcss.com/docs/responsive-design)
