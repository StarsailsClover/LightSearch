# -*- coding: utf-8 -*-
import re
import os

print("=" * 50)
print("  LightSearch 完整修复和文件拆分")
print("=" * 50)
print()

# 读取源文件
print("[1/6] 读取源文件...")
with open('standalone.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取 CSS
print("[2/6] 提取 CSS...")
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    css = css_match.group(1).strip()
    
    # 添加暗黑模式修复
    dark_mode_fix = """
/* 暗黑模式输入框修复 */
body.theme-dark input[type="text"],
body.theme-dark textarea,
body.theme-dark select {
    background-color: var(--ls-card-bg);
    color: var(--ls-text);
    border-color: var(--ls-border);
}
"""
    
    css = css + dark_mode_fix
    
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("  ✓ CSS 已保存到 styles.css")

# 提取 JavaScript
print("[3/6] 提取 JavaScript...")
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if js_match:
    js = js_match.group(1).strip()
    
    # 添加多语言支持
    multilang_js = """
// ========== 多语言支持 ==========
const LANG_DATA = {
    en: {
        searchPlaceholder: 'Enter search keywords...',
        searchButton: 'Search',
        settingsButton: 'Settings',
        academicButton: 'Academic Search',
        themeButton: 'Toggle Theme',
        historyTitle: 'Search History',
        noHistory: 'No search history',
        settingsTitle: 'Settings',
        academicTitle: 'Academic Search'
    },
    zh: {
        searchPlaceholder: '输入搜索关键词...',
        searchButton: '搜索',
        settingsButton: '设置',
        academicButton: '学术搜索',
        themeButton: '切换主题',
        historyTitle: '搜索历史',
        noHistory: '暂无搜索历史',
        settingsTitle: '设置',
        academicTitle: '学术搜索'
    },
    ja: {
        searchPlaceholder: '検索キーワードを入力...',
        searchButton: '検索',
        settingsButton: '設定',
        academicButton: '学術検索',
        themeButton: 'テーマ切替',
        historyTitle: '検索履歴',
        noHistory: '検索履歴がありません',
        settingsTitle: '設定',
        academicTitle: '学術検索'
    },
    ko: {
        searchPlaceholder: '검색 키워드 입력...',
        searchButton: '검색',
        settingsButton: '설정',
        academicButton: '학술 검색',
        themeButton: '테마 전환',
        historyTitle: '검색 기록',
        noHistory: '검색 기록이 없습니다',
        settingsTitle: '설정',
        academicTitle: '학술 검색'
    },
    ru: {
        searchPlaceholder: 'Введите ключевые слова...',
        searchButton: 'Поиск',
        settingsButton: 'Настройки',
        academicButton: 'Академический поиск',
        themeButton: 'Переключить тему',
        historyTitle: 'История поиска',
        noHistory: 'Нет истории поиска',
        settingsTitle: 'Настройки',
        academicTitle: 'Академический поиск'
    }
};

let currentLang = localStorage.getItem('ls-language') || navigator.language.slice(0, 2) || 'en';
if (!LANG_DATA[currentLang]) currentLang = 'en';

function t(key) {
    return LANG_DATA[currentLang]?.[key] || LANG_DATA.en[key] || key;
}

function applyLanguage() {
    document.title = 'LightSearch - ' + (currentLang === 'zh' ? '简洁优雅的聚合搜索引擎' : 'Simple & Elegant Search Aggregator');
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = t('searchButton');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.textContent = t('settingsButton');
    
    const academicBtn = document.getElementById('academicBtn');
    if (academicBtn) academicBtn.textContent = t('academicButton');
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.textContent = t('themeButton');
    
    const settingsTitle = document.querySelector('#settingsPopup h2');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');
    
    const academicTitle = document.querySelector('#academicPopup h2');
    if (academicTitle) academicTitle.textContent = t('academicTitle');
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    renderHistory();
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ls-language', lang);
    applyLanguage();
}

// 页面加载时应用语言
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLanguage);
} else {
    applyLanguage();
}
"""
    
    js = js + multilang_js
    
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("  ✓ JavaScript 已保存到 script.js")

# 创建新的 HTML
print("[4/6] 创建新的 HTML...")

# 移除内联的 style 和 script
new_html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="styles.css">', content, flags=re.DOTALL)
new_html = re.sub(r'<script>.*?</script>', '<script src="script.js"></script>', new_html, flags=re.DOTALL)

# 修改标题
new_html = re.sub(r'<title>.*?</title>', '<title>LightSearch - Simple & Elegant Search Aggregator</title>', new_html)

# 添加语言选择器
lang_selector = '''            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--ls-border);">
                <h3 style="margin-bottom: 10px; font-size: 1rem;">语言 / Language</h3>
                <select id="langSelect" onchange="switchLanguage(this.value)" style="width: 100%; padding: 10px; border: 1px solid var(--ls-border); border-radius: var(--ls-radius-sm); font-size: 0.95rem; background-color: var(--ls-card-bg); color: var(--ls-text);">
                    <option value="en">English</option>
                    <option value="zh">简体中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="ru">Русский</option>
                </select>
            </div>
'''

# 在设置弹窗结束前添加
new_html = re.sub(r'(</div>\s*</div>\s*<!-- 学术搜索弹窗 -->)', lang_selector + r'\n        \1', new_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
print("  ✓ HTML 已保存到 index.html")

# 清理旧文件
print("[5/6] 检查旧文件...")
for old_file in ['styles-old.css', 'script-old.js']:
    if os.path.exists(old_file):
        os.remove(old_file)
        print(f"  ! 已删除 {old_file}")

# 验证文件
print("[6/6] 验证文件...")

files_ok = True
for filename in ['index.html', 'styles.css', 'script.js']:
    if os.path.exists(filename):
        size = os.path.getsize(filename) / 1024
        print(f"  ✓ {filename} ({size:.1f} KB)")
    else:
        print(f"  ✗ {filename} 未找到")
        files_ok = False

print()
print("=" * 50)

if files_ok:
    print("  ✅ 所有文件创建成功！")
    print()
    print("文件结构：")
    print("  index.html  - 主页面")
    print("  styles.css  - 样式表")
    print("  script.js   - 脚本文件")
    print()
    print("修复内容：")
    print("  ✓ 暗黑模式输入框修复")
    print("  ✓ 多语言支持（5种语言）")
    print("  ✓ 文件拆分（HTML/CSS/JS）")
    print()
    print("立即测试：")
    print("  双击 index.html 或运行 start-server.bat")
else:
    print("  ✗ 文件创建失败")

print("=" * 50)
print()
