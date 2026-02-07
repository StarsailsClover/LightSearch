# LightSearch 迁移指南

从旧版本迁移到重构版本的完整指南。

## 📋 迁移检查清单

### 1. 文件结构变化

**旧版本：**
```
LightSearch/
├── index.html
├── styles.css
├── script.js
├── utils.js
└── AcademicSearch/
    ├── index.html
    ├── script.js
    └── styles.css
```

**新版本：**
```
LightSearch/
├── index-new.html          # 新版主页
├── src/
│   ├── app.js
│   ├── core/
│   │   ├── i18n.js
│   │   ├── popup.js
│   │   ├── theme.js
│   │   ├── commandPalette.js
│   │   └── searchEngine.js
│   └── styles/
│       ├── main.css
│       └── command-palette.css
└── locales/
    ├── zh.json
    ├── en.json
    ├── ja.json
    ├── ko.json
    └── ru.json
```

### 2. 数据迁移

所有旧版本的数据都会自动保留，因为使用相同的 localStorage 键名：

| 旧键名 | 新键名 | 说明 |
|--------|--------|------|
| `engines` | `ls-engines` | 搜索引擎列表 |
| `academicEngines` | `ls-academic-engines` | 学术引擎列表 |
| `searchHistory` | `ls-search-history` | 搜索历史 |
| `theme` | `ls-theme` | 主题设置 |
| `background` | `ls-background` | 背景图片 |

**迁移脚本（可选）：**
```javascript
// 在浏览器控制台运行
function migrateData() {
    const migrations = {
        'engines': 'ls-engines',
        'academicEngines': 'ls-academic-engines',
        'searchHistory': 'ls-search-history',
        'theme': 'ls-theme',
        'background': 'ls-background'
    };

    Object.entries(migrations).forEach(([oldKey, newKey]) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData && !localStorage.getItem(newKey)) {
            localStorage.setItem(newKey, oldData);
            console.log(`✅ Migrated ${oldKey} → ${newKey}`);
        }
    });

    console.log('✨ Migration complete!');
}

migrateData();
```

### 3. CSS类名变化

#### 搜索区域
```diff
- .search-container → .ls-search-container
- .search-box → .ls-search-box
- #search-input → .ls-search-input
- #search-button → .ls-search-btn
```

#### 按钮
```diff
- .control-buttons → .ls-controls
- button → .ls-btn
```

#### 弹窗
```diff
- .settings → .ls-popup.ls-settings
- .popup → .ls-popup
- .popup-content → .ls-popup__body
- .close-button → .ls-popup__close
```

#### 历史记录
```diff
- .search-history → .ls-history
- .history-item → .ls-history__item
```

### 4. JavaScript API 变化

#### 旧版本
```javascript
// 旧版本
import { storage, themeUtils, historyUtils } from './utils.js';

storage.get('engines');
themeUtils.init();
historyUtils.render('search-history');
```

#### 新版本
```javascript
// 新版本
import { searchEngine } from './src/core/searchEngine.js';
import { themeManager } from './src/core/theme.js';
import { i18n } from './src/core/i18n.js';

searchEngine.engines;
themeManager.applyTheme('classic');
i18n.t('search.placeholder');
```

### 5. 功能对照表

| 旧版本功能 | 新版本功能 | 增强点 |
|-----------|-----------|--------|
| 设置面板（侧边栏） | 设置弹窗 | 更好的UX，无错位 |
| 学术搜索（独立页面） | 学术搜索弹窗 | 无需跳转页面 |
| 主题切换（深/浅） | 4种主题 + 自定义 | 新增Liquid Glass |
| 单语言 | 5种语言 | 自动检测 + 手动切换 |
| - | Command Palette | 全新功能 |
| - | 搜索对比模式 | 全新功能 |
| 搜索历史 | 增强的搜索历史 | 更智能的管理 |

## 🔄 逐步迁移步骤

### 步骤 1：备份旧版本
```bash
# 创建备份
cp -r LightSearch LightSearch-backup
```

### 步骤 2：测试新版本
1. 打开 `index-new.html`
2. 测试所有功能
3. 确认数据正常

### 步骤 3：切换到新版本
```bash
# 重命名文件
mv index.html index-old.html
mv index-new.html index.html
```

### 步骤 4：清理（可选）
```bash
# 删除旧文件（谨慎操作）
rm -rf AcademicSearch/
rm script.js utils.js styles.css
```

## 🐛 常见问题

### Q1: 为什么我的搜索引擎列表是空的？
**A:** 运行数据迁移脚本，或手动添加引擎。

### Q2: 主题没有正确应用？
**A:** 清除浏览器缓存，刷新页面。

### Q3: 弹窗无法关闭？
**A:** 检查是否正确引入了 `popup.js` 模块。

### Q4: 语言切换不生效？
**A:** 确保 `locales/` 目录中的语言文件存在。

### Q5: Command Palette 快捷键不工作？
**A:** 检查是否有其他扩展占用了 `Ctrl+K` 快捷键。

## 🎯 性能优化建议

### 1. 使用本地服务器
避免 CORS 问题，推荐使用：
```bash
python -m http.server 8000
# 或
npx http-server -p 8000
```

### 2. 启用浏览器缓存
新版本使用 ES6 模块，浏览器会自动缓存。

### 3. 减少启用的搜索引擎
如果搜索速度慢，可以禁用一些不常用的引擎。

## 📊 新旧版本对比

| 指标 | 旧版本 | 新版本 | 改进 |
|------|--------|--------|------|
| 代码行数 | ~500 | ~1200 | 更模块化 |
| 文件数量 | 7 | 12 | 更清晰的结构 |
| 支持语言 | 1 | 5 | +400% |
| 主题数量 | 2 | 4 | +100% |
| 弹窗系统 | 基础 | 完整 | 无错位/异常 |
| 命名规范 | 混乱 | BEM | 可维护性↑ |

## 🚀 下一步

迁移完成后，你可以：

1. ✅ 探索新主题（特别是 Liquid Glass）
2. ✅ 尝试 Command Palette（`Ctrl+K`）
3. ✅ 启用搜索对比模式
4. ✅ 切换到你喜欢的语言
5. ✅ 自定义背景图片

## 💡 提示

- 保留旧版本备份至少一周
- 逐步熟悉新功能
- 有问题随时提 Issue

---

**需要帮助？** [提交 Issue](https://github.com/StarsailsClover/LightSearch/issues)
