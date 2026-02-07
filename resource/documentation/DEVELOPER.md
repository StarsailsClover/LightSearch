# LightSearch 开发者文档

完整的技术文档，帮助你理解和扩展 LightSearch。

## 🏗️ 架构设计

### 核心原则

1. **模块化** - 每个功能独立模块
2. **单一职责** - 每个模块只做一件事
3. **依赖注入** - 松耦合设计
4. **事件驱动** - 组件间通过事件通信

### 架构图

```
┌─────────────────────────────────────────┐
│           index.html (View)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          app.js (Controller)            │
│  - 初始化所有模块                        │
│  - 绑定事件                              │
│  - 协调模块间通信                        │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐          ┌─────▼─────┐
│ Core   │          │  Styles   │
│ Modules│          │   (CSS)   │
└───┬────┘          └───────────┘
    │
    ├── i18n.js (国际化)
    ├── popup.js (弹窗管理)
    ├── theme.js (主题管理)
    ├── commandPalette.js (命令面板)
    └── searchEngine.js (搜索引擎)
```

## 📦 核心模块详解

### 1. i18n.js - 国际化系统

**职责：** 多语言支持

**核心API：**
```javascript
// 检测语言
i18n.detectLanguage() // 返回: 'zh' | 'en' | 'ja' | 'ko' | 'ru'

// 加载语言包
await i18n.loadLanguage('zh')

// 翻译
i18n.t('search.placeholder') // 返回: "输入搜索关键词..."
i18n.t('messages.engineAdded', { name: 'Google' })

// 切换语言
await i18n.switchLanguage('en')

// 更新DOM
i18n.updateDOM()
```

**数据流：**
```
用户操作 → detectLanguage() → loadLanguage() 
→ 更新 translations → updateDOM() → 界面更新
```

**扩展示例：**
```javascript
// 添加新语言
// 1. 创建 locales/de.json
{
  "search": {
    "placeholder": "Suchbegriffe eingeben..."
  }
}

// 2. 在 i18n.js 中添加
getSupportedLanguages() {
    return [
        // ...
        { code: 'de', name: 'German', nativeName: 'Deutsch' }
    ];
}
```

---

### 2. popup.js - 弹窗管理系统

**职责：** 统一管理所有弹窗

**核心API：**
```javascript
// 注册弹窗
popupManager.register('settings', element)

// 打开弹窗
popupManager.open('settings', { exclusive: true })

// 关闭弹窗
popupManager.close('settings')

// 关闭所有
popupManager.closeAll()

// 切换
popupManager.toggle('settings')

// 检查状态
popupManager.isOpen('settings') // 返回: boolean
```

**事件系统：**
```javascript
element.addEventListener('popupOpened', (e) => {
    console.log('弹窗已打开:', e.detail.name);
});

element.addEventListener('popupClosed', (e) => {
    console.log('弹窗已关闭:', e.detail.name);
});
```

**关键特性：**
- ✅ 自动管理遮罩层
- ✅ 支持 ESC 键关闭
- ✅ 禁止背景滚动
- ✅ 自动聚焦输入框
- ✅ 过渡动画支持

**为什么不用 display:none？**
```css
/* ❌ 错误 - 无法过渡 */
.popup {
    display: none;
    transition: opacity 0.3s;
}

/* ✅ 正确 - 使用 opacity + pointer-events */
.ls-popup {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}

.ls-popup.is-active {
    opacity: 1;
    pointer-events: auto;
}
```

---

### 3. theme.js - 主题管理系统

**职责：** 主题切换和管理

**核心API：**
```javascript
// 应用主题
themeManager.applyTheme('liquid-glass')

// 切换深色模式
themeManager.toggleDarkMode()

// 获取当前主题
themeManager.getCurrentTheme() // 返回: 'classic'

// 获取所有主题
themeManager.getThemes()

// 监听系统主题
themeManager.watchSystemTheme()
```

**主题结构：**
```javascript
{
    'theme-id': {
        name: '主题名称',
        colors: {
            '--ls-bg': '#ffffff',
            '--ls-text': '#000000',
            // ...
        },
        effects: {
            backdropFilter: 'blur(10px)',
            glassEffect: true
        }
    }
}
```

**添加新主题：**
```javascript
// 在 theme.js 中
this.themes['my-theme'] = {
    name: 'My Awesome Theme',
    colors: {
        '--ls-bg': '#ff6b6b',
        '--ls-text': '#ffffff',
        '--ls-accent': '#4ecdc4',
        '--ls-card-bg': '#ffe66d',
        '--ls-border': '#a8dadc',
        '--ls-shadow': '0 4px 12px rgba(0,0,0,0.15)'
    }
};
```

**Liquid Glass 实现原理：**
```css
/* 1. 渐变背景 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 2. 玻璃态效果 */
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.18);

/* 3. 阴影增强 */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

---

### 4. commandPalette.js - 命令面板

**职责：** 快速访问所有功能

**核心API：**
```javascript
// 打开命令面板
commandPalette.open()

// 关闭命令面板
commandPalette.close()

// 注册自定义命令
commandPalette.registerCommand({
    id: 'my-command',
    category: 'settings',
    name: () => '我的命令',
    keywords: ['关键词1', '关键词2'],
    action: () => {
        console.log('执行命令');
    }
});
```

**命令结构：**
```javascript
{
    id: 'unique-id',           // 唯一标识
    category: 'search',        // 分类
    name: () => i18n.t('...'), // 显示名称（函数，支持i18n）
    keywords: ['搜索', 'search'], // 搜索关键词
    action: () => { ... }      // 执行函数
}
```

**键盘导航：**
- `Ctrl+K` / `Cmd+K` - 打开
- `↑` / `↓` - 导航
- `Enter` - 执行
- `Esc` - 关闭

---

### 5. searchEngine.js - 搜索引擎管理

**职责：** 管理搜索引擎和执行搜索

**核心API：**
```javascript
// 添加引擎
searchEngine.addEngine('Google', 'https://google.com/search?q={query}')

// 删除引擎
searchEngine.deleteEngine(0)

// 切换启用状态
searchEngine.toggleEngine(0)

// 执行搜索
searchEngine.search('关键词', {
    academic: false,
    timeFilter: '5',
    comparison: true
})

// 搜索历史
searchEngine.addToHistory('关键词')
searchEngine.clearHistory()
searchEngine.getSuggestions('关键')

// 对比模式
searchEngine.toggleComparisonMode()
```

**搜索流程：**
```
用户输入 → search() → 验证 → 添加历史 
→ 构建URL → 打开标签页/对比窗口
```

**对比模式实现：**
```javascript
openComparison(urls) {
    const html = `
        <div class="header">
            ${urls.map(item => `
                <button onclick="switchTab(${idx})">
                    ${item.name}
                </button>
            `).join('')}
        </div>
        <div class="content">
            ${urls.map(item => `
                <iframe src="${item.url}"></iframe>
            `).join('')}
        </div>
    `;
    window.open('', '_blank').document.write(html);
}
```

## 🎨 CSS架构

### BEM命名规范

```css
/* Block（块） */
.ls-popup { }

/* Element（元素） */
.ls-popup__header { }
.ls-popup__body { }
.ls-popup__close { }

/* Modifier（修饰符） */
.ls-popup--large { }
.ls-popup--fullscreen { }

/* 状态类 */
.is-active { }
.is-hidden { }
.has-error { }

/* JavaScript钩子（CSS不碰） */
.js-popup-close { }
.js-search-btn { }
```

### CSS变量系统

```css
:root {
    /* 颜色 */
    --ls-bg: #ffffff;
    --ls-text: #000000;
    --ls-accent: #4285f4;
    
    /* 间距 */
    --ls-spacing-xs: 4px;
    --ls-spacing-sm: 8px;
    --ls-spacing-md: 16px;
    
    /* 圆角 */
    --ls-radius-sm: 4px;
    --ls-radius-md: 8px;
    
    /* 过渡 */
    --ls-transition-fast: 0.15s ease;
    --ls-transition-normal: 0.25s ease;
    
    /* Z-index */
    --ls-z-overlay: 900;
    --ls-z-popup: 1000;
}
```

### 布局模型

**只使用 Flex 和 Grid：**
```css
/* ✅ 正确 */
.ls-search-box {
    display: flex;
    gap: 8px;
}

.ls-settings__item {
    display: flex;
    justify-content: space-between;
}

/* ❌ 禁止 */
.old-layout {
    float: left;  /* 禁用 */
    position: absolute; /* 仅装饰层 */
}
```

## 🔧 开发工具

### 调试技巧

```javascript
// 1. 开启调试模式
localStorage.setItem('ls-debug', 'true');

// 2. 查看当前状态
console.log('Theme:', themeManager.getCurrentTheme());
console.log('Language:', i18n.getCurrentLanguage());
console.log('Engines:', searchEngine.engines);

// 3. 监听事件
document.addEventListener('themeChanged', (e) => {
    console.log('主题已切换:', e.detail.theme);
});
```

### 性能优化

```javascript
// 1. 使用 RAF 优化动画
requestAnimationFrame(() => {
    element.classList.add('is-active');
});

// 2. 防抖搜索建议
const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

input.addEventListener('input', debounce((e) => {
    showSuggestions(e.target.value);
}, 300));

// 3. 虚拟滚动（大量历史记录）
// TODO: 实现虚拟滚动
```

## 📝 代码规范

### JavaScript

```javascript
// ✅ 使用 ES6+
import { module } from './module.js';
const arrow = () => {};
const { destructure } = object;

// ✅ 单一职责
class ThemeManager {
    // 只管理主题
}

// ✅ 命名清晰
function performSearch() { }  // 动词开头
const isActive = true;        // 布尔值 is/has 开头
const userSettings = {};      // 名词

// ❌ 避免
var oldStyle;                 // 使用 const/let
function a() { }              // 命名不清晰
```

### CSS

```css
/* ✅ 使用变量 */
.ls-btn {
    padding: var(--ls-spacing-md);
    border-radius: var(--ls-radius-md);
}

/* ✅ 移动端优先 */
.ls-popup {
    width: 100%;
}

@media (min-width: 768px) {
    .ls-popup {
        width: 600px;
    }
}

/* ❌ 避免 */
.btn {
    padding: 16px;  /* 硬编码 */
}

@media (max-width: 768px) {
    /* 桌面优先（不推荐） */
}
```

## 🧪 测试

### 手动测试清单

- [ ] 所有语言切换正常
- [ ] 所有主题显示正确
- [ ] 弹窗打开/关闭无错位
- [ ] 搜索功能正常
- [ ] 历史记录正常
- [ ] Command Palette 快捷键工作
- [ ] 移动端响应式正常
- [ ] 数据持久化正常

### 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|---------|------|
| Chrome | 90+ | 完全支持 |
| Firefox | 88+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| Edge | 90+ | 完全支持 |

## 🚀 部署

### 静态部署

```bash
# 1. 构建（无需构建，纯静态）
# 2. 部署到任何静态服务器
# GitHub Pages / Vercel / Netlify
```

### CDN优化

```html
<!-- 可选：使用CDN加速字体 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
```

## 📚 参考资源

- [BEM命名规范](http://getbem.com/)
- [CSS变量](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [ES6模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Liquid Glass设计](https://github.com/bergice/liquidglass)

---

**有问题？** [提交 Issue](https://github.com/StarsailsClover/LightSearch/issues)
