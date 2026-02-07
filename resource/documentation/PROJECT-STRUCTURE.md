# 📁 LightSearch 项目结构说明

完整的项目文件组织和说明。

## 🌳 目录树

```
LightSearch/
│
├── 📄 index-new.html              # 新版主页（重构版入口）
├── 📄 index.html                  # 旧版主页（保留备份）
├── 🖼️ icon.png                    # 项目图标
│
├── 📁 src/                        # 源代码目录
│   ├── 📄 app.js                  # 主应用程序（入口文件）
│   │
│   ├── 📁 core/                   # 核心模块
│   │   ├── 📄 i18n.js             # 国际化系统
│   │   ├── 📄 popup.js            # 弹窗管理器
│   │   ├── 📄 theme.js            # 主题管理器
│   │   ├── 📄 commandPalette.js   # 命令面板
│   │   └── 📄 searchEngine.js     # 搜索引擎管理
│   │
│   └── 📁 styles/                 # 样式文件
│       ├── 📄 main.css            # 主样式表
│       └── 📄 command-palette.css # 命令面板样式
│
├── 📁 locales/                    # 语言包
│   ├── 📄 zh.json                 # 简体中文
│   ├── 📄 en.json                 # English
│   ├── 📄 ja.json                 # 日本語
│   ├── 📄 ko.json                 # 한국어
│   └── 📄 ru.json                 # Русский
│
├── 📁 AcademicSearch/             # 旧版学术搜索（已弃用）
│   ├── 📄 index.html
│   ├── 📄 script.js
│   ├── 📄 styles.css
│   └── 🖼️ icon.png
│
├── 📄 script.js                   # 旧版脚本（已弃用）
├── 📄 utils.js                    # 旧版工具（已弃用）
├── 📄 styles.css                  # 旧版样式（已弃用）
│
├── 📄 README.md                   # 原始说明文档
├── 📄 README-REFACTOR.md          # 重构版说明文档 ⭐
├── 📄 QUICKSTART.md               # 快速开始指南 ⭐
├── 📄 DEVELOPER.md                # 开发者文档 ⭐
├── 📄 MIGRATION.md                # 迁移指南 ⭐
├── 📄 PROJECT-SUMMARY.md          # 项目总结 ⭐
├── 📄 PROJECT-STRUCTURE.md        # 本文档 ⭐
│
├── 📄 LICENSE                     # GPL-3.0 许可证
└── 📄 BingSiteAuth.xml            # Bing 站点验证
```

## 📝 文件说明

### 核心文件

#### `index-new.html` ⭐ 重要
**用途：** 新版主页，重构版的入口文件  
**特点：**
- 使用 BEM 命名规范
- 模块化 JavaScript
- 完整的 i18n 支持
- 弹窗化设计

**如何使用：**
```bash
# 直接打开
双击 index-new.html

# 或使用本地服务器
python -m http.server 8000
# 访问 http://localhost:8000/index-new.html
```

#### `src/app.js` ⭐ 核心
**用途：** 主应用程序，协调所有模块  
**职责：**
- 初始化所有核心模块
- 绑定事件监听器
- 协调模块间通信
- 管理应用生命周期

**依赖关系：**
```javascript
app.js
├── i18n.js
├── popup.js
├── theme.js
├── commandPalette.js
└── searchEngine.js
```

---

### 核心模块（src/core/）

#### `i18n.js` - 国际化系统
**职责：** 多语言支持  
**功能：**
- 自动检测用户语言
- 加载语言包
- 翻译文本
- 更新 DOM

**API：**
```javascript
i18n.detectLanguage()
i18n.loadLanguage('zh')
i18n.t('search.placeholder')
i18n.switchLanguage('en')
```

#### `popup.js` - 弹窗管理器
**职责：** 统一管理所有弹窗  
**功能：**
- 注册弹窗
- 打开/关闭弹窗
- 管理遮罩层
- 事件通知

**API：**
```javascript
popupManager.register('settings', element)
popupManager.open('settings')
popupManager.close('settings')
popupManager.toggle('settings')
```

#### `theme.js` - 主题管理器
**职责：** 主题切换和管理  
**功能：**
- 应用主题
- 切换深色模式
- 监听系统主题
- 玻璃态效果

**API：**
```javascript
themeManager.applyTheme('liquid-glass')
themeManager.toggleDarkMode()
themeManager.getCurrentTheme()
```

#### `commandPalette.js` - 命令面板
**职责：** 快速访问所有功能  
**功能：**
- 命令搜索
- 键盘导航
- 命令执行
- 自定义命令

**API：**
```javascript
commandPalette.open()
commandPalette.close()
commandPalette.registerCommand({...})
```

#### `searchEngine.js` - 搜索引擎管理
**职责：** 管理搜索引擎和执行搜索  
**功能：**
- 引擎管理
- 执行搜索
- 搜索历史
- 对比模式

**API：**
```javascript
searchEngine.addEngine(name, url)
searchEngine.search(query, options)
searchEngine.toggleComparisonMode()
```

---

### 样式文件（src/styles/）

#### `main.css` ⭐ 主样式表
**内容：**
- CSS 变量系统
- 全局重置
- 布局容器
- 组件样式
- 主题样式
- 响应式设计

**命名规范：** BEM
```css
.ls-组件名              /* Block */
.ls-组件名__元素名      /* Element */
.ls-组件名--修饰符      /* Modifier */
.is-状态                /* State */
.js-功能名              /* JS Hook */
```

#### `command-palette.css` - 命令面板样式
**内容：**
- 命令面板布局
- 输入框样式
- 结果列表
- 主题适配

---

### 语言包（locales/）

#### 语言包结构
```json
{
  "app": {
    "name": "LightSearch",
    "tagline": "..."
  },
  "search": {
    "placeholder": "...",
    "button": "..."
  },
  "settings": {
    "title": "...",
    ...
  }
}
```

#### 支持的语言
- `zh.json` - 简体中文
- `en.json` - English
- `ja.json` - 日本語
- `ko.json` - 한국어
- `ru.json` - Русский

---

### 文档文件

#### `README-REFACTOR.md` ⭐ 必读
**内容：**
- 项目概览
- 新特性介绍
- 快速开始
- 使用指南

**适合：** 所有用户

#### `QUICKSTART.md` ⭐ 新手友好
**内容：**
- 5分钟上手
- 核心功能
- 常见问题
- 最佳实践

**适合：** 新用户

#### `DEVELOPER.md` ⭐ 开发者必读
**内容：**
- 架构设计
- 模块详解
- 开发规范
- 调试技巧

**适合：** 开发者、贡献者

#### `MIGRATION.md` ⭐ 迁移必读
**内容：**
- 迁移检查清单
- 数据迁移
- API 变化
- 常见问题

**适合：** 旧版本用户

#### `PROJECT-SUMMARY.md` ⭐ 项目总结
**内容：**
- 已完成工作
- 技术栈
- 性能优化
- 未来规划

**适合：** 项目管理者、贡献者

---

## 🔄 文件依赖关系

### HTML → JavaScript
```
index-new.html
    ↓
src/app.js (type="module")
    ↓
├── src/core/i18n.js
├── src/core/popup.js
├── src/core/theme.js
├── src/core/commandPalette.js
└── src/core/searchEngine.js
```

### HTML → CSS
```
index-new.html
    ↓
src/styles/main.css
    ↓
src/styles/command-palette.css (可选)
```

### JavaScript → JSON
```
src/core/i18n.js
    ↓
locales/*.json
```

---

## 📦 模块加载顺序

### 1. HTML 加载
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./src/styles/main.css">
</head>
<body>
    <!-- DOM 结构 -->
    <script type="module" src="./src/app.js"></script>
</body>
</html>
```

### 2. JavaScript 初始化
```javascript
// app.js
import { i18n } from './core/i18n.js';
import { popupManager } from './core/popup.js';
import { themeManager } from './core/theme.js';
import { commandPalette } from './core/commandPalette.js';
import { searchEngine } from './core/searchEngine.js';

// 初始化顺序
1. i18n.loadLanguage()
2. themeManager.applyTheme()
3. popupManager.register()
4. commandPalette.init()
5. searchEngine.loadEngines()
```

---

## 🗂️ 数据存储

### LocalStorage 键名
```javascript
'ls-language'          // 当前语言
'ls-theme'             // 当前主题
'ls-engines'           // 搜索引擎列表
'ls-academic-engines'  // 学术引擎列表
'ls-search-history'    // 搜索历史
'ls-background'        // 背景图片
'ls-comparison-mode'   // 对比模式
'ls-theme-auto'        // 自动主题
```

---

## 🚀 启动流程

### 完整启动流程
```
1. 用户打开 index-new.html
    ↓
2. 浏览器加载 HTML
    ↓
3. 加载 CSS (main.css)
    ↓
4. 加载 JavaScript (app.js)
    ↓
5. DOMContentLoaded 事件触发
    ↓
6. 初始化 i18n
    ├── 检测语言
    ├── 加载语言包
    └── 更新 DOM
    ↓
7. 初始化 theme
    ├── 加载主题
    └── 应用主题
    ↓
8. 初始化 UI
    ├── 注册弹窗
    ├── 渲染历史
    └── 渲染引擎列表
    ↓
9. 绑定事件
    ├── 搜索事件
    ├── 按钮事件
    └── 快捷键
    ↓
10. 应用就绪 ✅
```

---

## 🔧 开发建议

### 修改文件时的注意事项

#### 修改 HTML
```html
<!-- ✅ 使用 BEM 命名 -->
<div class="ls-popup">
    <div class="ls-popup__header"></div>
</div>

<!-- ✅ 添加 i18n 属性 -->
<button data-i18n="settings.title">Settings</button>

<!-- ✅ 添加 JS 钩子 -->
<button class="ls-btn js-search-btn">Search</button>
```

#### 修改 CSS
```css
/* ✅ 使用 CSS 变量 */
.ls-btn {
    padding: var(--ls-spacing-md);
    border-radius: var(--ls-radius-md);
}

/* ✅ 遵循 BEM */
.ls-popup { }
.ls-popup__header { }
.ls-popup--large { }
```

#### 修改 JavaScript
```javascript
// ✅ 使用 ES6 模块
import { module } from './module.js';

// ✅ 使用事件通信
document.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { theme: 'dark' }
}));

// ✅ 单一职责
class ThemeManager {
    // 只管理主题相关功能
}
```

---

## 📊 文件大小参考

| 文件 | 大小 | 说明 |
|------|------|------|
| index-new.html | ~10KB | 主页 |
| src/app.js | ~8KB | 主应用 |
| src/core/*.js | ~5-8KB | 核心模块 |
| src/styles/main.css | ~15KB | 主样式 |
| locales/*.json | ~2-3KB | 语言包 |

**总计：** ~100KB（未压缩）

---

## 🎯 快速定位

### 我想修改...

| 需求 | 文件位置 |
|------|---------|
| 页面布局 | `index-new.html` |
| 样式外观 | `src/styles/main.css` |
| 主题颜色 | `src/core/theme.js` |
| 翻译文本 | `locales/*.json` |
| 搜索逻辑 | `src/core/searchEngine.js` |
| 弹窗行为 | `src/core/popup.js` |
| 命令面板 | `src/core/commandPalette.js` |

---

**需要帮助？** 查看 [开发者文档](./DEVELOPER.md)
