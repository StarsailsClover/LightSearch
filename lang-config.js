// LightSearch 多语言配置
const LANGUAGES = {
    'en': {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        file: 'index.html',
        translations: {
            appName: 'LightSearch',
            searchPlaceholder: 'Enter search keywords...',
            searchButton: 'Search',
            settingsButton: 'Settings',
            academicButton: 'Academic Search',
            historyTitle: 'Search History',
            noHistory: 'No search history',
            
            // 设置
            settingsTitle: 'Settings',
            closeButton: 'Close',
            
            // 搜索引擎
            enginesTitle: 'Search Engines',
            addEngine: 'Add Engine',
            addEnginePlaceholder: 'Add engine (include {query})',
            deleteEngine: 'Delete',
            
            // 主题
            themeTitle: 'Theme',
            themeLight: 'Light',
            themeDark: 'Dark',
            toggleTheme: 'Toggle Theme',
            
            // 语言
            languageTitle: 'Language',
            
            // 学术搜索
            academicTitle: 'Academic Search',
            academicPlaceholder: 'Enter academic keywords...',
            timeFilter: 'Publication Time',
            timeAny: 'Any Time',
            time1y: 'Past Year',
            time5y: 'Past 5 Years',
            time10y: 'Past 10 Years',
            
            // 消息
            emptySearch: 'Please enter search keywords',
            engineAdded: 'Engine added successfully',
            invalidEngine: 'Please include {query} as keyword placeholder'
        }
    },
    'zh': {
        code: 'zh',
        name: 'Chinese',
        nativeName: '简体中文',
        file: 'index-zh.html',
        translations: {
            appName: 'LightSearch',
            searchPlaceholder: '输入搜索关键词...',
            searchButton: '搜索',
            settingsButton: '设置',
            academicButton: '学术搜索',
            historyTitle: '搜索历史',
            noHistory: '暂无搜索历史',
            
            settingsTitle: '设置',
            closeButton: '关闭',
            
            enginesTitle: '搜索引擎',
            addEngine: '添加引擎',
            addEnginePlaceholder: '添加引擎（包含 {query}）',
            deleteEngine: '删除',
            
            themeTitle: '主题',
            themeLight: '浅色',
            themeDark: '深色',
            toggleTheme: '切换主题',
            
            languageTitle: '语言',
            
            academicTitle: '学术搜索',
            academicPlaceholder: '输入学术关键词...',
            timeFilter: '发表时间',
            timeAny: '不限',
            time1y: '近1年',
            time5y: '近5年',
            time10y: '近10年',
            
            emptySearch: '请输入搜索关键词',
            engineAdded: '引擎添加成功',
            invalidEngine: '请包含 {query} 作为关键词占位符'
        }
    },
    'ja': {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        file: 'index-ja.html',
        translations: {
            appName: 'LightSearch',
            searchPlaceholder: '検索キーワードを入力...',
            searchButton: '検索',
            settingsButton: '設定',
            academicButton: '学術検索',
            historyTitle: '検索履歴',
            noHistory: '検索履歴がありません',
            
            settingsTitle: '設定',
            closeButton: '閉じる',
            
            enginesTitle: '検索エンジン',
            addEngine: 'エンジンを追加',
            addEnginePlaceholder: 'エンジンを追加（{query}を含む）',
            deleteEngine: '削除',
            
            themeTitle: 'テーマ',
            themeLight: 'ライト',
            themeDark: 'ダーク',
            toggleTheme: 'テーマ切替',
            
            languageTitle: '言語',
            
            academicTitle: '学術検索',
            academicPlaceholder: '学術キーワードを入力...',
            timeFilter: '公開時期',
            timeAny: 'すべて',
            time1y: '過去1年',
            time5y: '過去5年',
            time10y: '過去10年',
            
            emptySearch: '検索キーワードを入力してください',
            engineAdded: 'エンジンが追加されました',
            invalidEngine: '{query}をキーワードプレースホルダーとして含めてください'
        }
    },
    'ko': {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        file: 'index-ko.html',
        translations: {
            appName: 'LightSearch',
            searchPlaceholder: '검색 키워드 입력...',
            searchButton: '검색',
            settingsButton: '설정',
            academicButton: '학술 검색',
            historyTitle: '검색 기록',
            noHistory: '검색 기록이 없습니다',
            
            settingsTitle: '설정',
            closeButton: '닫기',
            
            enginesTitle: '검색 엔진',
            addEngine: '엔진 추가',
            addEnginePlaceholder: '엔진 추가 ({query} 포함)',
            deleteEngine: '삭제',
            
            themeTitle: '테마',
            themeLight: '라이트',
            themeDark: '다크',
            toggleTheme: '테마 전환',
            
            languageTitle: '언어',
            
            academicTitle: '학술 검색',
            academicPlaceholder: '학술 키워드 입력...',
            timeFilter: '발행 시기',
            timeAny: '전체',
            time1y: '최근 1년',
            time5y: '최근 5년',
            time10y: '최근 10년',
            
            emptySearch: '검색 키워드를 입력하세요',
            engineAdded: '엔진이 추가되었습니다',
            invalidEngine: '{query}를 키워드 자리 표시자로 포함하세요'
        }
    },
    'ru': {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        file: 'index-ru.html',
        translations: {
            appName: 'LightSearch',
            searchPlaceholder: 'Введите ключевые слова...',
            searchButton: 'Поиск',
            settingsButton: 'Настройки',
            academicButton: 'Академический поиск',
            historyTitle: 'История поиска',
            noHistory: 'Нет истории поиска',
            
            settingsTitle: 'Настройки',
            closeButton: 'Закрыть',
            
            enginesTitle: 'Поисковые системы',
            addEngine: 'Добавить движок',
            addEnginePlaceholder: 'Добавить движок (включить {query})',
            deleteEngine: 'Удалить',
            
            themeTitle: 'Тема',
            themeLight: 'Светлая',
            themeDark: 'Темная',
            toggleTheme: 'Переключить тему',
            
            languageTitle: 'Язык',
            
            academicTitle: 'Академический поиск',
            academicPlaceholder: 'Введите академические ключевые слова...',
            timeFilter: 'Время публикации',
            timeAny: 'Любое время',
            time1y: 'За последний год',
            time5y: 'За последние 5 лет',
            time10y: 'За последние 10 лет',
            
            emptySearch: 'Пожалуйста, введите ключевые слова для поиска',
            engineAdded: 'Движок успешно добавлен',
            invalidEngine: 'Пожалуйста, включите {query} как заполнитель ключевого слова'
        }
    }
};

// 语言检测和跳转函数
function detectAndRedirect() {
    const savedLang = localStorage.getItem('ls-language');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 如果有保存的语言偏好
    if (savedLang && savedLang !== 'en') {
        const targetFile = LANGUAGES[savedLang]?.file;
        if (targetFile && currentPage !== targetFile) {
            window.location.href = targetFile;
            return true;
        }
    }
    
    // 如果没有保存的语言，检测浏览器语言
    if (!savedLang) {
        const browserLang = navigator.language.slice(0, 2);
        if (LANGUAGES[browserLang] && browserLang !== 'en') {
            const targetFile = LANGUAGES[browserLang].file;
            if (currentPage !== targetFile) {
                localStorage.setItem('ls-language', browserLang);
                window.location.href = targetFile;
                return true;
            }
        }
    }
    
    return false;
}

// 切换语言函数
function switchLanguage(langCode) {
    localStorage.setItem('ls-language', langCode);
    const targetFile = LANGUAGES[langCode]?.file || 'index.html';
    window.location.href = targetFile;
}

// 获取当前语言
function getCurrentLanguage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    for (const [code, lang] of Object.entries(LANGUAGES)) {
        if (lang.file === currentPage) {
            return code;
        }
    }
    return 'en';
}
