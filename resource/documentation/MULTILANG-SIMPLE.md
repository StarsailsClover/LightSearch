# 🎯 多语言版本快速部署方案

## ⚡ 最简单的实现方法

由于完整的HTML文件很大（18KB+），我为你准备了一个**超级简单的实现方案**：

### 方案：使用 JavaScript 动态翻译

**核心思路：**
- 只需要 1 个 HTML 文件（index.html）
- 使用 JavaScript 动态替换文本
- localStorage 记忆语言偏好
- 无需创建多个HTML文件

---

## 🚀 实现步骤

### 步骤1：在 index.html 中添加语言数据

在 `<script>` 标签开头添加：

```javascript
// 多语言数据
const TRANSLATIONS = {
    en: {
        title: 'LightSearch - Simple & Elegant Search Aggregator',
        searchPlaceholder: 'Enter search keywords...',
        searchButton: 'Search',
        settingsButton: 'Settings',
        academicButton: 'Academic Search',
        historyTitle: 'Search History',
        noHistory: 'No search history',
        settingsTitle: 'Settings',
        closeButton: 'Close',
        enginesTitle: 'Search Engines',
        addEngine: 'Add',
        addEnginePlaceholder: 'Add engine (include {query})',
        deleteEngine: 'Delete',
        themeTitle: 'Theme',
        toggleTheme: 'Toggle Theme',
        languageTitle: 'Language',
        academicTitle: 'Academic Search',
        academicPlaceholder: 'Enter academic keywords...',
        timeFilter: 'Publication Time',
        timeAny: 'Any Time',
        time1y: 'Past Year',
        time5y: 'Past 5 Years',
        time10y: 'Past 10 Years'
    },
    zh: {
        title: 'LightSearch - 简洁优雅的聚合搜索引擎',
        searchPlaceholder: '输入搜索关键词...',
        searchButton: '搜索',
        settingsButton: '设置',
        academicButton: '学术搜索',
        historyTitle: '搜索历史',
        noHistory: '暂无搜索历史',
        settingsTitle: '设置',
        closeButton: '关闭',
        enginesTitle: '搜索引擎',
        addEngine: '添加',
        addEnginePlaceholder: '添加引擎（包含 {query}）',
        deleteEngine: '删除',
        themeTitle: '主题',
        toggleTheme: '切换主题',
        languageTitle: '语言',
        academicTitle: '学术搜索',
        academicPlaceholder: '输入学术关键词...',
        timeFilter: '发表时间',
        timeAny: '不限',
        time1y: '近1年',
        time5y: '近5年',
        time10y: '近10年'
    },
    ja: {
        title: 'LightSearch - シンプルでエレガントな検索アグリゲーター',
        searchPlaceholder: '検索キーワードを入力...',
        searchButton: '検索',
        settingsButton: '設定',
        academicButton: '学術検索',
        historyTitle: '検索履歴',
        noHistory: '検索履歴がありません',
        settingsTitle: '設定',
        closeButton: '閉じる',
        enginesTitle: '検索エンジン',
        addEngine: '追加',
        addEnginePlaceholder: 'エンジンを追加（{query}を含む）',
        deleteEngine: '削除',
        themeTitle: 'テーマ',
        toggleTheme: 'テーマ切替',
        languageTitle: '言語',
        academicTitle: '学術検索',
        academicPlaceholder: '学術キーワードを入力...',
        timeFilter: '公開時期',
        timeAny: 'すべて',
        time1y: '過去1年',
        time5y: '過去5年',
        time10y: '過去10年'
    },
    ko: {
        title: 'LightSearch - 간단하고 우아한 검색 통합 도구',
        searchPlaceholder: '검색 키워드 입력...',
        searchButton: '검색',
        settingsButton: '설정',
        academicButton: '학술 검색',
        historyTitle: '검색 기록',
        noHistory: '검색 기록이 없습니다',
        settingsTitle: '설정',
        closeButton: '닫기',
        enginesTitle: '검색 엔진',
        addEngine: '추가',
        addEnginePlaceholder: '엔진 추가 ({query} 포함)',
        deleteEngine: '삭제',
        themeTitle: '테마',
        toggleTheme: '테마 전환',
        languageTitle: '언어',
        academicTitle: '학술 검색',
        academicPlaceholder: '학술 키워드 입력...',
        timeFilter: '발행 시기',
        timeAny: '전체',
        time1y: '최근 1년',
        time5y: '최근 5년',
        time10y: '최근 10년'
    },
    ru: {
        title: 'LightSearch - Простой и элегантный агрегатор поиска',
        searchPlaceholder: 'Введите ключевые слова...',
        searchButton: 'Поиск',
        settingsButton: 'Настройки',
        academicButton: 'Академический поиск',
        historyTitle: 'История поиска',
        noHistory: 'Нет истории поиска',
        settingsTitle: 'Настройки',
        closeButton: 'Закрыть',
        enginesTitle: 'Поисковые системы',
        addEngine: 'Добавить',
        addEnginePlaceholder: 'Добавить движок (включить {query})',
        deleteEngine: 'Удалить',
        themeTitle: 'Тема',
        toggleTheme: 'Переключить тему',
        languageTitle: 'Язык',
        academicTitle: 'Академический поиск',
        academicPlaceholder: 'Введите академические ключевые слова...',
        timeFilter: 'Время публикации',
        timeAny: 'Любое время',
        time1y: 'За последний год',
        time5y: 'За последние 5 лет',
        time10y: 'За последние 10 лет'
    }
};

// 当前语言
let currentLang = localStorage.getItem('ls-language') || navigator.language.slice(0, 2) || 'en';
if (!TRANSLATIONS[currentLang]) currentLang = 'en';

// 翻译函数
function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS.en[key] || key;
}

// 应用翻译
function applyTranslations() {
    document.title = t('title');
    document.querySelector('.js-search-input').placeholder = t('searchPlaceholder');
    document.querySelector('.js-search-btn').textContent = t('searchButton');
    document.querySelector('.js-settings-btn').textContent = t('settingsButton');
    document.querySelector('.js-academic-btn').textContent = t('academicButton');
    // ... 继续添加其他元素
}

// 切换语言
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ls-language', lang);
    applyTranslations();
}

// 页面加载时应用翻译
document.addEventListener('DOMContentLoaded', applyTranslations);
```

---

## ✅ 优点

1. **只需要1个HTML文件** - 易于维护
2. **动态切换** - 无需刷新页面
3. **完美支持 GitHub Pages** - 无任何问题
4. **易于添加新语言** - 只需添加翻译数据

---

## 🎯 你的选择

我现在可以为你：

### 选项A：创建动态多语言版本（推荐）⭐⭐⭐
- 修改当前的 index.html
- 添加多语言支持代码
- 1个文件搞定所有语言

### 选项B：创建5个独立HTML文件
- index.html (English)
- index-zh.html (简体中文)
- index-ja.html (日本語)
- index-ko.html (한국어)
- index-ru.html (Русский)

### 选项C：两种方案都做
- 动态版本作为主版本
- 独立文件作为备选

---

## 💡 我的建议

**推荐选项A（动态多语言）**

**原因：**
- ✅ 最简单 - 只需修改1个文件
- ✅ 最灵活 - 可以无刷新切换语言
- ✅ 最易维护 - 所有语言在一个地方
- ✅ 完美支持 GitHub Pages

**你想选择哪个选项？**

回复 "A"、"B" 或 "C"
