/*
 * 增强调试面板 v2.2
 * 包含完整的调试功能和GitHub Issue集成
 */

// ========== 调试面板HTML模板 ==========
const enhancedDebugPanelHTML = `
<div id="debugPanel" class="debug-panel minimized">
    <div class="debug-header" onclick="toggleDebugPanel()">
        <h3>🐛 Debug Panel v2.2</h3>
        <div class="debug-header-actions">
            <button class="debug-header-btn" onclick="event.stopPropagation(); toggleDebugMode()" title="切换调试模式">
                <span id="debugModeIndicator">🔴</span>
            </button>
            <button class="debug-header-btn" id="debugToggleBtn">▼</button>
        </div>
    </div>
    
    <div class="debug-content">
        <!-- 标签页 -->
        <div class="debug-tabs">
            <button class="debug-tab active" data-tab="overview">概览</button>
            <button class="debug-tab" data-tab="errors">错误</button>
            <button class="debug-tab" data-tab="params">参数</button>
            <button class="debug-tab" data-tab="export">导出</button>
            <button class="debug-tab" data-tab="github">GitHub</button>
        </div>
        
        <!-- 概览标签 -->
        <div class="debug-tab-content active" data-content="overview">
            <div class="debug-section">
                <h4>快速操作</h4>
                <div class="debug-actions">
                    <button class="debug-btn" onclick="debugFunctions.runFullDiagnostics()">完整诊断</button>
                    <button class="debug-btn" onclick="debugFunctions.quickFixAll()">快速修复</button>
                    <button class="debug-btn" onclick="debugFunctions.testAllFeatures()">测试功能</button>
                    <button class="debug-btn" onclick="debugFunctions.clearAllData()">清除数据</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>系统信息</h4>
                <div class="debug-info-grid">
                    <div class="debug-info-item">
                        <span class="debug-label">浏览器:</span>
                        <span class="debug-value" id="debug-browser">-</span>
                    </div>
                    <div class="debug-info-item">
                        <span class="debug-label">分辨率:</span>
                        <span class="debug-value" id="debug-screen">-</span>
                    </div>
                    <div class="debug-info-item">
                        <span class="debug-label">WebGL:</span>
                        <span class="debug-value" id="debug-webgl">-</span>
                    </div>
                    <div class="debug-info-item">
                        <span class="debug-label">主题:</span>
                        <span class="debug-value" id="debug-theme">-</span>
                    </div>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>应用状态</h4>
                <div class="debug-stats-grid">
                    <div class="debug-stat">
                        <div class="debug-stat-value" id="debug-engines-count">0</div>
                        <div class="debug-stat-label">搜索引擎</div>
                    </div>
                    <div class="debug-stat">
                        <div class="debug-stat-value" id="debug-errors-count">0</div>
                        <div class="debug-stat-label">错误数</div>
                    </div>
                    <div class="debug-stat">
                        <div class="debug-stat-value" id="debug-history-count">0</div>
                        <div class="debug-stat-label">历史记录</div>
                    </div>
                    <div class="debug-stat">
                        <div class="debug-stat-value" id="debug-storage-size">0KB</div>
                        <div class="debug-stat-label">存储大小</div>
                    </div>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>功能验证</h4>
                <div id="debug-feature-checks"></div>
            </div>
        </div>
        
        <!-- 错误标签 -->
        <div class="debug-tab-content" data-content="errors">
            <div class="debug-section">
                <div class="debug-section-header">
                    <h4>错误日志</h4>
                    <button class="debug-btn-sm" onclick="debugFunctions.clearErrors()">清除</button>
                </div>
                <div id="debug-error-list" class="debug-error-list"></div>
            </div>
            
            <div class="debug-section">
                <h4>控制台日志</h4>
                <div id="debug-console-log" class="debug-console"></div>
            </div>
        </div>
        
        <!-- 参数标签 -->
        <div class="debug-tab-content" data-content="params">
            <div class="debug-section">
                <h4>参数模式</h4>
                <div class="debug-param-controls">
                    <label class="debug-checkbox">
                        <input type="checkbox" id="debug-show-borders" onchange="debugFunctions.toggleBorders(this.checked)">
                        <span>显示组件边框</span>
                    </label>
                    <label class="debug-checkbox">
                        <input type="checkbox" id="debug-show-names" onchange="debugFunctions.toggleNames(this.checked)">
                        <span>显示组件名称</span>
                    </label>
                    <label class="debug-checkbox" id="debug-show-params" onchange="debugFunctions.toggleParams(this.checked)">
                        <input type="checkbox">
                        <span>显示参数信息</span>
                    </label>
                    <label class="debug-checkbox">
                        <input type="checkbox" id="debug-show-data" onchange="debugFunctions.toggleDataViz(this.checked)">
                        <span>显示数据图</span>
                    </label>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>组件树</h4>
                <div id="debug-component-tree" class="debug-tree"></div>
            </div>
            
            <div class="debug-section">
                <h4>数据可视化</h4>
                <canvas id="debug-data-chart" width="400" height="200"></canvas>
            </div>
        </div>
        
        <!-- 导出标签 -->
        <div class="debug-tab-content" data-content="export">
            <div class="debug-section">
                <h4>导出错误报告</h4>
                <div class="debug-export-options">
                    <label class="debug-checkbox">
                        <input type="checkbox" id="export-errors" checked>
                        <span>包含错误日志</span>
                    </label>
                    <label class="debug-checkbox">
                        <input type="checkbox" id="export-console" checked>
                        <span>包含控制台日志</span>
                    </label>
                    <label class="debug-checkbox">
                        <input type="checkbox" id="export-settings">
                        <span>包含设置信息</span>
                    </label>
                    <label class="debug-checkbox">
                        <input type="checkbox" id="export-system">
                        <span>包含系统信息</span>
                    </label>
                </div>
                <div class="debug-actions">
                    <button class="debug-btn" onclick="debugFunctions.exportReport('json')">导出为 JSON</button>
                    <button class="debug-btn" onclick="debugFunctions.exportReport('txt')">导出为 TXT</button>
                    <button class="debug-btn" onclick="debugFunctions.exportReport('md')">导出为 Markdown</button>
                    <button class="debug-btn" onclick="debugFunctions.copyToClipboard()">复制到剪贴板</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>预览</h4>
                <pre id="debug-export-preview" class="debug-preview"></pre>
            </div>
        </div>
        
        <!-- GitHub标签 -->
        <div class="debug-tab-content" data-content="github">
            <div class="debug-section">
                <h4>提交 GitHub Issue</h4>
                <p class="debug-hint">自动生成问题报告并跳转到 GitHub Issues</p>
                
                <div class="debug-form">
                    <div class="debug-form-group">
                        <label>问题标题</label>
                        <input type="text" id="github-issue-title" class="debug-input" placeholder="简要描述问题">
                    </div>
                    
                    <div class="debug-form-group">
                        <label>问题类型</label>
                        <select id="github-issue-type" class="debug-select">
                            <option value="bug">🐛 Bug / 错误</option>
                            <option value="feature">✨ Feature / 功能请求</option>
                            <option value="question">❓ Question / 问题</option>
                            <option value="enhancement">🚀 Enhancement / 改进</option>
                        </select>
                    </div>
                    
                    <div class="debug-form-group">
                        <label>详细描述</label>
                        <textarea id="github-issue-body" class="debug-textarea" rows="6" placeholder="详细描述问题..."></textarea>
                    </div>
                    
                    <div class="debug-form-group">
                        <label class="debug-checkbox">
                            <input type="checkbox" id="github-include-report" checked>
                            <span>包含错误报告</span>
                        </label>
                        <label class="debug-checkbox">
                            <input type="checkbox" id="github-include-screenshot">
                            <span>包含截图（需手动上传）</span>
                        </label>
                    </div>
                    
                    <div class="debug-actions">
                        <button class="debug-btn debug-btn-primary" onclick="debugFunctions.submitGitHubIssue()">
                            🚀 提交到 GitHub
                        </button>
                        <button class="debug-btn" onclick="debugFunctions.previewGitHubIssue()">
                            👁️ 预览
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="debug-section">
                <h4>Issue 预览</h4>
                <div id="github-issue-preview" class="debug-preview"></div>
            </div>
        </div>
    </div>
</div>
`;

// ========== 调试面板样式 ==========
const enhancedDebugPanelStyles = `
<style>
.debug-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 500px;
    max-height: 70vh;
    background: rgba(0, 0, 0, 0.95);
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 999999;
    border-top-left-radius: 12px;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.8);
    transition: transform 0.3s ease, max-height 0.3s ease;
    display: flex;
    flex-direction: column;
}

.debug-panel.minimized {
    transform: translateY(calc(100% - 45px));
}

.debug-header {
    padding: 12px 16px;
    background: rgba(0, 255, 0, 0.1);
    border-bottom: 2px solid #00ff00;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}

.debug-header h3 {
    margin: 0;
    font-size: 14px;
    color: #00ff00;
}

.debug-header-actions {
    display: flex;
    gap: 8px;
}

.debug-header-btn {
    background: none;
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
    transition: all 0.2s;
}

.debug-header-btn:hover {
    background: #00ff00;
    color: #000;
}

.debug-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.debug-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    border-bottom: 1px solid #333;
}

.debug-tab {
    background: none;
    border: none;
    color: #00aaff;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 11px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.debug-tab:hover {
    color: #00ff00;
}

.debug-tab.active {
    color: #00ff00;
    border-bottom-color: #00ff00;
}

.debug-tab-content {
    display: none;
}

.debug-tab-content.active {
    display: block;
}

.debug-section {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #333;
}

.debug-section h4 {
    color: #ffff00;
    font-size: 13px;
    margin-bottom: 10px;
}

.debug-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.debug-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.debug-btn {
    background: #00ff00;
    color: #000;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    transition: all 0.2s;
}

.debug-btn:hover {
    background: #00cc00;
    transform: translateY(-1px);
}

.debug-btn-primary {
    background: #0088ff;
    color: white;
}

.debug-btn-primary:hover {
    background: #0066cc;
}

.debug-btn-sm {
    padding: 4px 8px;
    font-size: 10px;
}

.debug-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.debug-info-item {
    font-size: 10px;
    padding: 6px;
    background: rgba(0, 255, 0, 0.05);
    border-radius: 4px;
}

.debug-label {
    color: #00aaff;
    margin-right: 6px;
}

.debug-value {
    color: #00ff00;
}

.debug-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.debug-stat {
    background: rgba(0, 255, 0, 0.1);
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #00ff00;
    text-align: center;
}

.debug-stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #00ff00;
    margin-bottom: 4px;
}

.debug-stat-label {
    font-size: 9px;
    color: #00aaff;
}

.debug-error-list {
    max-height: 200px;
    overflow-y: auto;
}

.debug-error-item {
    background: rgba(255, 0, 0, 0.1);
    border-left: 3px solid #ff0000;
    padding: 8px;
    margin: 4px 0;
    border-radius: 4px;
    font-size: 10px;
}

.debug-console {
    max-height: 150px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
}

.debug-console-item {
    margin: 2px 0;
    padding: 2px 0;
    border-bottom: 1px solid #222;
}

.debug-param-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.debug-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 11px;
}

.debug-checkbox input {
    cursor: pointer;
}

.debug-tree {
    max-height: 300px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
}

.debug-export-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.debug-preview {
    background: rgba(0, 0, 0, 0.5);
    padding: 12px;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    font-size: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.debug-form-group {
    margin-bottom: 12px;
}

.debug-form-group label {
    display: block;
    color: #00aaff;
    margin-bottom: 6px;
    font-size: 11px;
}

.debug-input,
.debug-select,
.debug-textarea {
    width: 100%;
    background: rgba(0, 255, 0, 0.05);
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
}

.debug-textarea {
    resize: vertical;
}

.debug-hint {
    color: #00aaff;
    font-size: 10px;
    margin-bottom: 12px;
    font-style: italic;
}

/* 参数模式样式 */
.debug-mode-active .ls-search-container,
.debug-mode-active .ls-popup,
.debug-mode-active .ls-btn,
.debug-mode-active .ls-search-input,
.debug-mode-active .ls-select {
    outline: 2px dashed #ff00ff !important;
    position: relative !important;
}

.debug-component-label {
    position: absolute;
    top: -20px;
    left: 0;
    background: #ff00ff;
    color: white;
    padding: 2px 6px;
    font-size: 10px;
    border-radius: 3px;
    z-index: 999999;
    pointer-events: none;
}

/* 滚动条样式 */
.debug-content::-webkit-scrollbar,
.debug-error-list::-webkit-scrollbar,
.debug-console::-webkit-scrollbar,
.debug-tree::-webkit-scrollbar,
.debug-preview::-webkit-scrollbar {
    width: 6px;
}

.debug-content::-webkit-scrollbar-track,
.debug-error-list::-webkit-scrollbar-track,
.debug-console::-webkit-scrollbar-track,
.debug-tree::-webkit-scrollbar-track,
.debug-preview::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
}

.debug-content::-webkit-scrollbar-thumb,
.debug-error-list::-webkit-scrollbar-thumb,
.debug-console::-webkit-scrollbar-thumb,
.debug-tree::-webkit-scrollbar-thumb,
.debug-preview::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 3px;
}

@media (max-width: 768px) {
    .debug-panel {
        width: 100%;
        max-width: 100%;
    }
    
    .debug-actions {
        grid-template-columns: 1fr;
    }
}
</style>
`;

console.log('✅ Enhanced debug panel v2.2 loaded');
