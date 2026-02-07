# 🌍 LightSearch 多语言版本实现指南

## 📋 实现方案

### 架构设计

```
访问流程：
1. 用户访问 index.html（默认英文）
2. 检测 localStorage 中的语言偏好
3. 如果有偏好且不是英文，自动跳转到对应语言版本
4. 用户可在设置中切换语言，跳转到对应版本

文件结构：
├── index.html (en - English) - 默认
├── index-zh.html (zh - 简体中文)
├── index-ja.html (ja - 日本語)
├── index-ko.html (ko - 한국어)
└── index-ru.html (ru - Русский)
```

---

## 🚀 实现步骤

### 步骤1：准备基础文件

当前 `index.html` 已经是单文件版本（从 standalone.html 复制）

### 步骤2：修改 index.html 添加语言检测

在 `index.html` 的 `<script>` 部分开头添加：

```javascript
// 语言检测和自动跳转
(function() {
    const savedLang = localStorage.getItem('ls-language');
    const langFiles = {
        'zh': 'index-zh.html',
        'ja': 'index-ja.html',
        'ko': 'index-ko.html',
        'ru': 'index-ru.html'
    };
    
    // 如果有保存的语言偏好且不是英文，跳转
    if (savedLang && savedLang !== 'en' && langFiles[savedLang]) {
        window.location.href = langFiles[savedLang];
        return;
    }
    
    // 如果没有保存的语言，检测浏览器语言
    if (!savedLang) {
        const browserLang = navigator.language.slice(0, 2);
        if (langFiles[browserLang]) {
            localStorage.setItem('ls-language', browserLang);
            window.location.href = langFiles[browserLang];
            return;
        }
        // 默认保存为英文
        localStorage.setItem('ls-language', 'en');
    }
})();
```

### 步骤3：添加语言切换功能

在设置弹窗中添加语言选择器：

```html
<!-- 在设置弹窗中添加 -->
<div class="ls-settings__section">
    <h3 class="ls-settings__section-title">Language / 语言</h3>
    <select class="ls-select" id="language-select" onchange="switchLanguage(this.value)">
        <option value="en">English</option>
        <option value="zh">简体中文</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="ru">Русский</option>
    </select>
</div>
```

添加切换函数：

```javascript
function switchLanguage(langCode) {
    const langFiles = {
        'en': 'index.html',
        'zh': 'index-zh.html',
        'ja': 'index-ja.html',
        'ko': 'index-ko.html',
        'ru': 'index-ru.html'
    };
    
    localStorage.setItem('ls-language', langCode);
    window.location.href = langFiles[langCode] || 'index.html';
}

// 页面加载时设置当前语言
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = 'en'; // 当前页面的语言代码
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = currentLang;
    }
});
```

### 步骤4：创建其他语言版本

#### 方式A：手动创建（推荐，更精确）

1. 复制 `index.html` 为 `index-zh.html`
2. 修改以下内容：
   - `<html lang="en">` → `<html lang="zh-CN">`
   - `<title>` 标题
   - 所有界面文本
   - 脚本中的 `currentLang = 'en'` → `currentLang = 'zh'`

#### 方式B：使用生成脚本（快速但需要检查）

运行：
```bash
generate-lang-versions.bat
```

---

## 📝 需要翻译的文本列表

### 主要界面

| 英文 | 中文 | 日文 | 韩文 | 俄文 |
|------|------|------|------|------|
| LightSearch | LightSearch | LightSearch | LightSearch | LightSearch |
| Enter search keywords... | 输入搜索关键词... | 検索キーワードを入力... | 검색 키워드 입력... | Введите ключевые слова... |
| Search | 搜索 | 検索 | 검색 | Поиск |
| Settings | 设置 | 設定 | 설정 | Настройки |
| Academic Search | 学术搜索 | 学術検索 | 학술 검색 | Академический поиск |
| Search History | 搜索历史 | 検索履歴 | 검색 기록 | История поиска |
| No search history | 暂无搜索历史 | 検索履歴がありません | 검색 기록이 없습니다 | Нет истории поиска |

### 设置界面

| 英文 | 中文 | 日文 | 韩文 | 俄文 |
|------|------|------|------|------|
| Close | 关闭 | 閉じる | 닫기 | Закрыть |
| Search Engines | 搜索引擎 | 検索エンジン | 검색 엔진 | Поисковые системы |
| Add | 添加 | 追加 | 추가 | Добавить |
| Delete | 删除 | 削除 | 삭제 | Удалить |
| Theme | 主题 | テーマ | 테마 | Тема |
| Toggle Theme | 切换主题 | テーマ切替 | 테마 전환 | Переключить тему |
| Language | 语言 | 言語 | 언어 | Язык |

### 学术搜索

| 英文 | 中文 | 日文 | 韩文 | 俄文 |
|------|------|------|------|------|
| Publication Time | 发表时间 | 公开時期 | 발행 시기 | Время публикации |
| Any Time | 不限 | すべて | 전체 | Любое время |
| Past Year | 近1年 | 过去1年 | 최근 1년 | За последний год |
| Past 5 Years | 近5年 | 過去5年 | 최근 5년 | За последние 5 лет |
| Past 10 Years | 近10年 | 過去10年 | 최근 10년 | За последние 10 лет |

---

## 🔧 快速实现方案

### 我为你准备了两个选择：

#### 选择1：我帮你生成所有语言版本（推荐）⭐⭐⭐

我可以直接为你创建所有5个语言版本的HTML文件，每个文件都是完整的、可以直接使用的。

**优点：**
- ✅ 立即可用
- ✅ 翻译准确
- ✅ 无需手动操作

#### 选择2：你使用生成脚本

运行 `generate-lang-versions.bat`，然后手动检查和调整翻译。

**优点：**
- ✅ 可以自定义翻译
- ✅ 学习实现过程

---

## 📊 实现后的效果

### 用户体验流程

```
首次访问：
1. 用户访问 index.html
2. 检测浏览器语言（如：zh-CN）
3. 自动跳转到 index-zh.html
4. 保存语言偏好到 localStorage

再次访问：
1. 用户访问 index.html
2. 读取 localStorage（zh）
3. 自动跳转到 index-zh.html

切换语言：
1. 用户在设置中选择"日本語"
2. 保存到 localStorage
3. 跳转到 index-ja.html
4. 下次访问自动使用日语版本
```

---

## ✅ 验证清单

创建完成后，测试每个语言版本：

- [ ] index.html (English) - 默认版本
- [ ] index-zh.html (简体中文)
- [ ] index-ja.html (日本語)
- [ ] index-ko.html (한국어)
- [ ] index-ru.html (Русский)

每个版本测试：
- [ ] 页面正常显示
- [ ] 所有文本已翻译
- [ ] 语言选择器显示当前语言
- [ ] 切换语言功能正常
- [ ] localStorage 正确保存

---

## 🎯 下一步

**请告诉我你的选择：**

1. **我帮你生成所有语言版本** - 我会直接创建5个完整的HTML文件
2. **你自己使用脚本生成** - 运行 generate-lang-versions.bat

**推荐选择1**，这样可以确保翻译质量和功能完整性。

你想选择哪个方案？
