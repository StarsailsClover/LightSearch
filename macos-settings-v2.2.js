/*
 * macOS 风格设置面板
 * 重新设计设置UI，参考macOS系统偏好设置
 */

// ========== macOS 风格设置面板样式 ==========
const macOSSettingsStyles = `
<style id="macos-settings-styles">
    /* macOS 风格设置面板 */
    .ls-settings-macos {
        display: flex;
        height: 600px;
        max-height: 80vh;
    }
    
    /* 侧边栏 */
    .ls-settings-sidebar {
        width: 200px;
        background: rgba(246, 246, 246, 0.95);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        padding: 20px 0;
        overflow-y: auto;
    }
    
    body.theme-dark .ls-settings-sidebar {
        background: rgba(40, 40, 40, 0.95);
        border-right-color: rgba(255, 255, 255, 0.1);
    }
    
    .ls-settings-sidebar-item {
        padding: 10px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        color: #333;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
    }
    
    body.theme-dark .ls-settings-sidebar-item {
        color: #ddd;
    }
    
    .ls-settings-sidebar-item:hover {
        background: rgba(0, 0, 0, 0.05);
    }
    
    body.theme-dark .ls-settings-sidebar-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .ls-settings-sidebar-item.active {
        background: rgba(0, 122, 255, 0.1);
        border-left-color: #007AFF;
        color: #007AFF;
        font-weight: 500;
    }
    
    .ls-settings-sidebar-icon {
        font-size: 1.2rem;
    }
    
    /* 内容区域 */
    .ls-settings-content {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.95);
    }
    
    body.theme-dark .ls-settings-content {
        background: rgba(30, 30, 30, 0.95);
    }
    
    .ls-settings-panel {
        display: none;
    }
    
    .ls-settings-panel.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .ls-settings-panel-title {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 10px;
        color: #333;
    }
    
    body.theme-dark .ls-settings-panel-title {
        color: #fff;
    }
    
    .ls-settings-panel-description {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 30px;
    }
    
    body.theme-dark .ls-settings-panel-description {
        color: #999;
    }
    
    /* 设置组 */
    .ls-settings-group {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    body.theme-dark .ls-settings-group {
        background: rgba(50, 50, 50, 0.95);
    }
    
    .ls-settings-group-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
    }
    
    body.theme-dark .ls-settings-group-title {
        color: #fff;
    }
    
    /* 设置行 */
    .ls-settings-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .ls-settings-row:last-child {
        border-bottom: none;
    }
    
    body.theme-dark .ls-settings-row {
        border-bottom-color: rgba(255, 255, 255, 0.05);
    }
    
    .ls-settings-row-label {
        flex: 1;
    }
    
    .ls-settings-row-title {
        font-size: 0.95rem;
        color: #333;
        margin-bottom: 4px;
    }
    
    body.theme-dark .ls-settings-row-title {
        color: #fff;
    }
    
    .ls-settings-row-description {
        font-size: 0.8rem;
        color: #666;
    }
    
    body.theme-dark .ls-settings-row-description {
        color: #999;
    }
    
    .ls-settings-row-control {
        margin-left: 20px;
    }
    
    /* macOS 风格开关 */
    .ls-switch-macos {
        position: relative;
        width: 51px;
        height: 31px;
    }
    
    .ls-switch-macos input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .ls-switch-macos-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #e5e5ea;
        transition: 0.3s;
        border-radius: 31px;
    }
    
    .ls-switch-macos-slider:before {
        position: absolute;
        content: "";
        height: 27px;
        width: 27px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .ls-switch-macos input:checked + .ls-switch-macos-slider {
        background-color: #34C759;
    }
    
    .ls-switch-macos input:checked + .ls-switch-macos-slider:before {
        transform: translateX(20px);
    }
    
    /* macOS 风格选择器 */
    .ls-select-macos {
        padding: 8px 30px 8px 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        background: white;
        color: #333;
        font-size: 0.9rem;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        min-width: 150px;
    }
    
    body.theme-dark .ls-select-macos {
        background: rgba(50, 50, 50, 0.95);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    }
    
    .ls-select-macos:hover {
        border-color: rgba(0, 0, 0, 0.2);
    }
    
    .ls-select-macos:focus {
        outline: none;
        border-color: #007AFF;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }
    
    /* macOS 风格按钮 */
    .ls-btn-macos {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #007AFF;
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .ls-btn-macos:hover {
        background: #0051D5;
    }
    
    .ls-btn-macos:active {
        transform: scale(0.98);
    }
    
    .ls-btn-macos-secondary {
        background: rgba(0, 0, 0, 0.05);
        color: #333;
    }
    
    body.theme-dark .ls-btn-macos-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    
    .ls-btn-macos-secondary:hover {
        background: rgba(0, 0, 0, 0.1);
    }
    
    /* 自定义颜色选择器 */
    .ls-color-picker-custom {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .ls-color-picker-custom:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .ls-color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }
    
    /* Logo 上传区域 */
    .ls-logo-upload-area {
        border: 2px dashed rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .ls-logo-upload-area:hover {
        border-color: #007AFF;
        background: rgba(0, 122, 255, 0.05);
    }
    
    .ls-logo-preview {
        max-width: 200px;
        max-height: 100px;
        margin: 10px auto;
        display: block;
    }
</style>
`;

// ========== macOS 风格设置面板HTML ==========
const macOSSettingsHTML = `
<div class="ls-settings-macos">
    <!-- 侧边栏 -->
    <div class="ls-settings-sidebar">
        <div class="ls-settings-sidebar-item active" data-panel="general">
            <span class="ls-settings-sidebar-icon">⚙️</span>
            <span>通用</span>
        </div>
        <div class="ls-settings-sidebar-item" data-panel="appearance">
            <span class="ls-settings-sidebar-icon">🎨</span>
            <span>外观</span>
        </div>
        <div class="ls-settings-sidebar-item" data-panel="search">
            <span class="ls-settings-sidebar-icon">🔍</span>
            <span>搜索引擎</span>
        </div>
        <div class="ls-settings-sidebar-item" data-panel="language">
            <span class="ls-settings-sidebar-icon">🌐</span>
            <span>语言</span>
        </div>
        <div class="ls-settings-sidebar-item" data-panel="advanced">
            <span class="ls-settings-sidebar-icon">🔧</span>
            <span>高级</span>
        </div>
        <div class="ls-settings-sidebar-item" data-panel="debug">
            <span class="ls-settings-sidebar-icon">🐛</span>
            <span>调试</span>
        </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="ls-settings-content">
        <!-- 通用面板 -->
        <div class="ls-settings-panel active" data-panel-content="general">
            <h2 class="ls-settings-panel-title">通用</h2>
            <p class="ls-settings-panel-description">基本设置和偏好</p>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">Logo</h3>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">打字机动画</div>
                        <div class="ls-settings-row-description">在主页显示打字机效果</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <label class="ls-switch-macos">
                            <input type="checkbox" id="logoTypingSwitch-macos" checked>
                            <span class="ls-switch-macos-slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">自定义 Logo</div>
                        <div class="ls-settings-row-description">上传自定义 Logo 图片</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <button class="ls-btn-macos" onclick="openLogoUploader()">上传</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 外观面板 -->
        <div class="ls-settings-panel" data-panel-content="appearance">
            <h2 class="ls-settings-panel-title">外观</h2>
            <p class="ls-settings-panel-description">自定义界面外观</p>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">主题</h3>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">主题样式</div>
                        <div class="ls-settings-row-description">选择界面主题</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <select class="ls-select-macos" id="themeSelect-macos">
                            <option value="classic">LightSearch Classic</option>
                            <option value="liquid-glass">Liquid Glass</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">显示模式</h3>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">模式选择</div>
                        <div class="ls-settings-row-description">手动或自动切换明暗模式</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <select class="ls-select-macos" id="displayModeMethod-macos">
                            <option value="manual">手动</option>
                            <option value="auto">自动</option>
                        </select>
                    </div>
                </div>
                
                <div class="ls-settings-row" id="manualModeRow-macos">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">明亮 / 黑暗模式</div>
                        <div class="ls-settings-row-description">手动切换显示模式</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <label class="ls-switch-macos">
                            <input type="checkbox" id="manualDarkModeSwitch-macos">
                            <span class="ls-switch-macos-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">强调色</h3>
                
                <div class="ls-color-grid" id="accentColorGrid-macos">
                    <!-- 颜色选择器将在这里动态生成 -->
                </div>
            </div>
        </div>
        
        <!-- 搜索引擎面板 -->
        <div class="ls-settings-panel" data-panel-content="search">
            <h2 class="ls-settings-panel-title">搜索引擎</h2>
            <p class="ls-settings-panel-description">管理搜索引擎</p>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">已启用的搜索引擎</h3>
                <div id="engineList-macos">
                    <!-- 引擎列表将在这里动态生成 -->
                </div>
                
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <input type="text" class="ls-select-macos" id="newEngineInput-macos" 
                           placeholder="添加引擎 (包含 {query})" style="flex: 1;">
                    <button class="ls-btn-macos" onclick="addEngineMacOS()">添加</button>
                </div>
            </div>
        </div>
        
        <!-- 语言面板 -->
        <div class="ls-settings-panel" data-panel-content="language">
            <h2 class="ls-settings-panel-title">语言</h2>
            <p class="ls-settings-panel-description">选择界面语言</p>
            
            <div class="ls-settings-group">
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">界面语言</div>
                        <div class="ls-settings-row-description">选择显示语言</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <select class="ls-select-macos" id="langSelect-macos">
                            <option value="en">English</option>
                            <option value="zh">简体中文</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 高级面板 -->
        <div class="ls-settings-panel" data-panel-content="advanced">
            <h2 class="ls-settings-panel-title">高级</h2>
            <p class="ls-settings-panel-description">高级设置和选项</p>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">背景</h3>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">背景图片</div>
                        <div class="ls-settings-row-description">上传自定义背景图片</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <button class="ls-btn-macos" onclick="document.getElementById('bgImageInput').click()">上传</button>
                    </div>
                </div>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">模糊效果</div>
                        <div class="ls-settings-row-description">调整背景模糊程度: <span id="blurValue-macos">0</span>px</div>
                    </div>
                    <div class="ls-settings-row-control" style="width: 200px;">
                        <input type="range" class="ls-slider" id="blurSlider-macos" 
                               min="0" max="50" value="0" style="width: 100%;">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 调试面板 -->
        <div class="ls-settings-panel" data-panel-content="debug">
            <h2 class="ls-settings-panel-title">调试</h2>
            <p class="ls-settings-panel-description">调试工具和选项</p>
            
            <div class="ls-settings-group">
                <h3 class="ls-settings-group-title">调试模式</h3>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">启用调试模式</div>
                        <div class="ls-settings-row-description">显示调试面板和工具</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <button class="ls-btn-macos" onclick="openDebugMode()">打开调试模式</button>
                    </div>
                </div>
                
                <div class="ls-settings-row">
                    <div class="ls-settings-row-label">
                        <div class="ls-settings-row-title">参数模式</div>
                        <div class="ls-settings-row-description">显示组件边框和参数</div>
                    </div>
                    <div class="ls-settings-row-control">
                        <label class="ls-switch-macos">
                            <input type="checkbox" id="paramModeSwitch-macos" onchange="toggleParamMode(this.checked)">
                            <span class="ls-switch-macos-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ========== 初始化 macOS 风格设置 ==========
function initMacOSSettings() {
    // 添加样式
    if (!document.getElementById('macos-settings-styles')) {
        document.head.insertAdjacentHTML('beforeend', macOSSettingsStyles);
    }
    
    // 替换设置弹窗内容
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        const popupBody = settingsPopup.querySelector('.ls-popup__body');
        if (popupBody) {
            popupBody.innerHTML = macOSSettingsHTML;
            
            // 绑定侧边栏切换
            bindMacOSSidebar();
            
            // 加载设置
            loadMacOSSettings();
            
            // 绑定事件
            bindMacOSEvents();
        }
    }
    
    console.log('✅ macOS settings initialized');
}

// 绑定侧边栏
function bindMacOSSidebar() {
    const sidebarItems = document.querySelectorAll('.ls-settings-sidebar-item');
    const panels = document.querySelectorAll('.ls-settings-panel');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const panelName = item.dataset.panel;
            
            // 更新侧边栏激活状态
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // 更新面板显示
            panels.forEach(p => {
                if (p.dataset.panelContent === panelName) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        });
    });
}

// 加载设置到 macOS 界面
function loadMacOSSettings() {
    if (typeof settings === 'undefined') return;
    
    // 加载打字机动画
    const logoTypingSwitch = document.getElementById('logoTypingSwitch-macos');
    if (logoTypingSwitch) logoTypingSwitch.checked = settings.logoTyping !== false; // 默认开启
    
    // 加载主题
    const themeSelect = document.getElementById('themeSelect-macos');
    if (themeSelect) themeSelect.value = settings.theme || 'classic';
    
    // 加载显示模式
    const displayModeMethod = document.getElementById('displayModeMethod-macos');
    if (displayModeMethod) displayModeMethod.value = settings.displayMode || 'manual';
    
    const manualDarkModeSwitch = document.getElementById('manualDarkModeSwitch-macos');
    if (manualDarkModeSwitch) manualDarkModeSwitch.checked = settings.darkMode || false;
    
    // 加载语言
    const langSelect = document.getElementById('langSelect-macos');
    if (langSelect) langSelect.value = currentLang || 'en';
    
    // 加载模糊效果
    const blurSlider = document.getElementById('blurSlider-macos');
    if (blurSlider) {
        blurSlider.value = settings.blurLevel || 0;
        document.getElementById('blurValue-macos').textContent = settings.blurLevel || 0;
    }
    
    // 渲染颜色选择器
    renderAccentColorGrid();
    
    // 渲染引擎列表
    renderEngineListMacOS();
}

// 渲染强调色网格
function renderAccentColorGrid() {
    const grid = document.getElementById('accentColorGrid-macos');
    if (!grid) return;
    
    const colors = ['#4285f4', '#ea4335', '#34a853', '#fbbc04', '#9c27b0', '#ff6d00', '#00bcd4', '#795548'];
    const currentColor = settings.accentColor || '#4285f4';
    
    grid.innerHTML = colors.map(color => `
        <div class="ls-color-picker-custom ${color === currentColor ? 'active' : ''}" 
             style="background-color: ${color};"
             onclick="setAccentColorMacOS('${color}')"></div>
    `).join('');
}

// 设置强调色
function setAccentColorMacOS(color) {
    if (settings.theme === 'liquid-glass') {
        alert(t('accentColorLocked') || 'Liquid Glass 主题下强调色已锁定');
        return;
    }
    
    updateTempSetting('accentColor', color);
    document.documentElement.style.setProperty('--ls-accent', color);
    renderAccentColorGrid();
}

// 渲染引擎列表
function renderEngineListMacOS() {
    const list = document.getElementById('engineList-macos');
    if (!list || !settings.engines) return;
    
    list.innerHTML = settings.engines.map((engine, idx) => `
        <div class="ls-settings-row">
            <div class="ls-settings-row-label">
                <div class="ls-settings-row-title">${engine.name}</div>
                <div class="ls-settings-row-description">${engine.url}</div>
            </div>
            <div class="ls-settings-row-control" style="display: flex; gap: 10px;">
                <label class="ls-switch-macos">
                    <input type="checkbox" ${engine.enabled ? 'checked' : ''} 
                           onchange="toggleEngineMacOS(${idx}, this.checked)">
                    <span class="ls-switch-macos-slider"></span>
                </label>
                <button class="ls-btn-macos ls-btn-macos-secondary" onclick="deleteEngineMacOS(${idx})">删除</button>
            </div>
        </div>
    `).join('');
}

// 添加引擎
function addEngineMacOS() {
    const input = document.getElementById('newEngineInput-macos');
    const url = input?.value.trim();
    
    if (!url) {
        alert(t('emptyInput') || '请输入搜索引擎URL');
        return;
    }
    if (!url.includes('{query}')) {
        alert(t('queryPlaceholder') || '请包含 {query} 作为关键词占位符');
        return;
    }
    
    const name = prompt(t('engineName') || '引擎名称：');
    if (!name) return;
    
    settings.engines.push({ name, url, enabled: true });
    storage.set('engines', settings.engines);
    renderEngineListMacOS();
    input.value = '';
}

// 切换引擎
function toggleEngineMacOS(idx, enabled) {
    if (!settings.engines[idx]) return;
    settings.engines[idx].enabled = enabled;
    storage.set('engines', settings.engines);
}

// 删除引擎
function deleteEngineMacOS(idx) {
    if (confirm(t('confirmDelete') || '确定要删除这个搜索引擎吗？')) {
        settings.engines.splice(idx, 1);
        storage.set('engines', settings.engines);
        renderEngineListMacOS();
    }
}

// 绑定 macOS 事件
function bindMacOSEvents() {
    // 打字机动画
    const logoTypingSwitch = document.getElementById('logoTypingSwitch-macos');
    if (logoTypingSwitch) {
        logoTypingSwitch.addEventListener('change', (e) => {
            updateTempSetting('logoTyping', e.target.checked);
        });
    }
    
    // 主题
    const themeSelect = document.getElementById('themeSelect-macos');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            updateTempSetting('theme', e.target.value);
            if (typeof applyTheme === 'function') {
                applyTheme(e.target.value);
            }
        });
    }
    
    // 显示模式
    const displayModeMethod = document.getElementById('displayModeMethod-macos');
    const manualModeRow = document.getElementById('manualModeRow-macos');
    
    if (displayModeMethod) {
        displayModeMethod.addEventListener('change', (e) => {
            updateTempSetting('displayMode', e.target.value);
            if (manualModeRow) {
                manualModeRow.style.display = e.target.value === 'manual' ? 'flex' : 'none';
            }
        });
    }
    
    // 手动暗黑模式
    const manualDarkModeSwitch = document.getElementById('manualDarkModeSwitch-macos');
    if (manualDarkModeSwitch) {
        manualDarkModeSwitch.addEventListener('change', (e) => {
            updateTempSetting('darkMode', e.target.checked);
            document.body.classList.toggle('theme-dark', e.target.checked);
        });
    }
    
    // 语言
    const langSelect = document.getElementById('langSelect-macos');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            if (typeof switchLanguage === 'function') {
                switchLanguage(e.target.value);
            }
        });
    }
    
    // 模糊效果
    const blurSlider = document.getElementById('blurSlider-macos');
    if (blurSlider) {
        blurSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            updateTempSetting('blurLevel', parseInt(value));
            document.documentElement.style.setProperty('--ls-blur', value + 'px');
            document.getElementById('blurValue-macos').textContent = value;
        });
    }
}

// 打开 Logo 上传器
function openLogoUploader() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (typeof ImageCropper !== 'undefined') {
                ImageCropper.open(file, (croppedDataURL) => {
                    updateTempSetting('logoCustom', croppedDataURL);
                    const logo = document.getElementById('logo');
                    if (logo) {
                        logo.style.backgroundImage = `url(${croppedDataURL})`;
                        logo.style.backgroundSize = 'contain';
                        logo.style.backgroundRepeat = 'no-repeat';
                        logo.style.backgroundPosition = 'center';
                        logo.textContent = '';
                    }
                });
            }
        }
    };
    input.click();
}

// 打开调试模式
function openDebugMode() {
    window.location.href = 'index-test.html';
}

// 切换参数模式
function toggleParamMode(enabled) {
    if (enabled) {
        document.body.classList.add('param-mode');
        if (typeof ParamMode !== 'undefined') {
            ParamMode.enable();
        }
    } else {
        document.body.classList.remove('param-mode');
        if (typeof ParamMode !== 'undefined') {
            ParamMode.disable();
        }
    }
}

console.log('✅ macOS settings module loaded');
