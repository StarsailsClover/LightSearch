/*
 * LightSearch 调试模式专用脚本
 * 包含所有主脚本功能 + 调试增强
 */

// 导入主脚本的所有功能（通过复制关键部分）
// 注意：这个文件应该在 script-new.js 之后加载

// ========== 调试增强功能 ==========

// 错误捕获增强
window.addEventListener('error', (event) => {
    console.error('🔴 Global Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    if (typeof ErrorMonitor !== 'undefined') {
        ErrorMonitor.log('E1001', event.message, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
    
    // 更新调试面板
    updateDebugErrorCount();
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🔴 Unhandled Promise Rejection:', event.reason);
    
    if (typeof ErrorMonitor !== 'undefined') {
        ErrorMonitor.log('E1001', 'Promise rejection', { reason: event.reason });
    }
    
    updateDebugErrorCount();
});

// ========== 调试面板增强 ==========

function updateDebugErrorCount() {
    const errorCountEl = document.getElementById('debug-errors-count');
    if (errorCountEl && typeof ErrorMonitor !== 'undefined') {
        errorCountEl.textContent = ErrorMonitor.getErrors().length;
    }
}

function debugShowErrors() {
    if (typeof ErrorMonitor === 'undefined') {
        console.warn('ErrorMonitor not available');
        return;
    }
    
    const errors = ErrorMonitor.getErrorLog();
    console.group('🐛 Error Log');
    console.table(errors);
    console.groupEnd();
    
    addDebugLog(`Showing ${errors.length} errors in console`, 'debug-success');
    
    // 在调试面板中显示
    const errorLogSection = document.getElementById('debug-error-log');
    if (errorLogSection) {
        errorLogSection.innerHTML = '<h4>Error Log</h4>';
        if (errors.length === 0) {
            errorLogSection.innerHTML += '<p style="color: #666;">No errors recorded</p>';
        } else {
            errors.forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'debug-error-item';
                errorDiv.innerHTML = `
                    <div><strong>${error.code}</strong>: ${error.message}</div>
                    <div style="font-size: 0.85em; color: #999;">${error.customMessage}</div>
                    <div style="font-size: 0.75em; color: #666;">${new Date(error.timestamp).toLocaleString()}</div>
                `;
                errorLogSection.appendChild(errorDiv);
            });
        }
    }
}

// ========== 弹窗功能修复 ==========

// 确保调试模式下弹窗可以正常打开
function ensurePopupsWork() {
    // 检查所有必需的函数是否存在
    const requiredFunctions = [
        'openPopup',
        'closePopup',
        'closeSettings',
        'saveSettings',
        'addEngine',
        'deleteEngine',
        'toggleEngine',
        'performAcademicSearch'
    ];
    
    const missingFunctions = [];
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            missingFunctions.push(funcName);
        }
    });
    
    if (missingFunctions.length > 0) {
        console.error('🔴 Missing functions:', missingFunctions);
        addDebugLog(`Missing functions: ${missingFunctions.join(', ')}`, 'debug-error');
    } else {
        console.log('✅ All required functions available');
        addDebugLog('All popup functions available', 'debug-success');
    }
}

// ========== DOM 检查 ==========

function checkDOMElements() {
    const requiredElements = [
        'searchInput',
        'searchBtn',
        'settingsBtn',
        'academicBtn',
        'settingsPopup',
        'academicPopup',
        'popupOverlay',
        'engineList',
        'historyContainer'
    ];
    
    const missingElements = [];
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('🔴 Missing DOM elements:', missingElements);
        addDebugLog(`Missing elements: ${missingElements.join(', ')}`, 'debug-error');
    } else {
        console.log('✅ All required DOM elements present');
        addDebugLog('All DOM elements present', 'debug-success');
    }
    
    return missingElements.length === 0;
}

// ========== 设置检查 ==========

function checkSettings() {
    if (typeof settings === 'undefined') {
        console.error('🔴 Settings object not defined');
        addDebugLog('Settings object not defined', 'debug-error');
        return false;
    }
    
    console.log('✅ Settings:', settings);
    addDebugLog('Settings loaded successfully', 'debug-success');
    
    // 检查必需的设置项
    const requiredSettings = ['engines', 'academicEngines', 'theme', 'darkMode'];
    const missingSettings = [];
    
    requiredSettings.forEach(key => {
        if (!(key in settings)) {
            missingSettings.push(key);
        }
    });
    
    if (missingSettings.length > 0) {
        console.warn('⚠️ Missing settings:', missingSettings);
        addDebugLog(`Missing settings: ${missingSettings.join(', ')}`, 'debug-warning');
    }
    
    return true;
}

// ========== 主题检查 ==========

function checkTheme() {
    const body = document.body;
    const classes = Array.from(body.classList);
    
    console.log('Current theme classes:', classes);
    addDebugLog(`Theme classes: ${classes.join(', ')}`, 'debug-success');
    
    // 检查 LiquidGlass
    if (classes.includes('theme-liquid-glass')) {
        console.log('✅ LiquidGlass theme active');
        addDebugLog('LiquidGlass theme active', 'debug-success');
        
        // 检查 WebGL
        const canvas = document.getElementById('liquidglass-canvas');
        if (canvas) {
            console.log('✅ LiquidGlass canvas found');
            addDebugLog('LiquidGlass canvas found', 'debug-success');
        } else {
            console.warn('⚠️ LiquidGlass canvas not found');
            addDebugLog('LiquidGlass canvas not found', 'debug-warning');
        }
    }
    
    // 检查暗黑模式
    if (classes.includes('theme-dark')) {
        console.log('✅ Dark mode active');
        addDebugLog('Dark mode active', 'debug-success');
    } else {
        console.log('ℹ️ Light mode active');
        addDebugLog('Light mode active', 'debug-success');
    }
}

// ========== 完整诊断 ==========

function runFullDiagnostics() {
    console.group('🔍 Running Full Diagnostics');
    
    addDebugLog('Starting full diagnostics...', 'debug-success');
    
    // 1. DOM 检查
    console.log('1. Checking DOM elements...');
    const domOk = checkDOMElements();
    
    // 2. 设置检查
    console.log('2. Checking settings...');
    const settingsOk = checkSettings();
    
    // 3. 函数检查
    console.log('3. Checking functions...');
    ensurePopupsWork();
    
    // 4. 主题检查
    console.log('4. Checking theme...');
    checkTheme();
    
    // 5. 错误检查
    console.log('5. Checking errors...');
    if (typeof ErrorMonitor !== 'undefined') {
        const errors = ErrorMonitor.getErrors();
        console.log(`Found ${errors.length} errors`);
        if (errors.length > 0) {
            console.table(errors);
        }
    }
    
    // 6. 本地存储检查
    console.log('6. Checking localStorage...');
    try {
        const testKey = '__ls_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✅ localStorage available');
        addDebugLog('localStorage available', 'debug-success');
    } catch (e) {
        console.error('🔴 localStorage not available:', e);
        addDebugLog('localStorage not available', 'debug-error');
    }
    
    console.groupEnd();
    
    addDebugLog('Diagnostics complete', 'debug-success');
    
    // 生成诊断报告
    const report = {
        dom: domOk,
        settings: settingsOk,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        errors: typeof ErrorMonitor !== 'undefined' ? ErrorMonitor.getErrors().length : 0
    };
    
    console.log('📊 Diagnostic Report:', report);
    
    return report;
}

// ========== 快速修复功能 ==========

function quickFixColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.style.cssText = 'display: none !important; position: absolute; left: -9999px; opacity: 0;';
        console.log('✅ colorPicker hidden');
        addDebugLog('colorPicker hidden', 'debug-success');
    }
}

function quickFixLiquidGlass() {
    if (typeof fixLiquidGlassStyles === 'function') {
        fixLiquidGlassStyles();
        console.log('✅ LiquidGlass styles fixed');
        addDebugLog('LiquidGlass styles fixed', 'debug-success');
    } else {
        console.warn('⚠️ fixLiquidGlassStyles not available');
        addDebugLog('fixLiquidGlassStyles not available', 'debug-warning');
    }
}

function quickFixAll() {
    console.log('🔧 Applying quick fixes...');
    addDebugLog('Applying quick fixes...', 'debug-success');
    
    quickFixColorPicker();
    quickFixLiquidGlass();
    
    // 重新渲染界面
    if (typeof renderEngines === 'function') {
        renderEngines();
    }
    if (typeof renderHistory === 'function') {
        renderHistory();
    }
    if (typeof renderAcademicEngines === 'function') {
        renderAcademicEngines();
    }
    
    console.log('✅ Quick fixes applied');
    addDebugLog('Quick fixes applied', 'debug-success');
}

// ========== 调试按钮功能 ==========

function debugTestPopup() {
    console.log('Testing popup...');
    addDebugLog('Testing settings popup', 'debug-success');
    
    if (typeof openPopup === 'function') {
        openPopup('settingsPopup');
        setTimeout(() => {
            if (typeof closePopup === 'function') {
                closePopup('settingsPopup');
                console.log('✅ Popup test passed');
                addDebugLog('Popup test passed', 'debug-success');
            }
        }, 2000);
    } else {
        console.error('🔴 openPopup function not available');
        addDebugLog('openPopup function not available', 'debug-error');
    }
}

function debugTestTheme() {
    console.log('Testing theme switch...');
    addDebugLog('Testing theme switch', 'debug-success');
    
    if (typeof settings !== 'undefined' && typeof applyTheme === 'function') {
        const currentTheme = settings.theme;
        const newTheme = currentTheme === 'classic' ? 'liquid-glass' : 'classic';
        
        settings.theme = newTheme;
        applyTheme(newTheme);
        
        setTimeout(() => {
            settings.theme = currentTheme;
            applyTheme(currentTheme);
            console.log('✅ Theme test passed');
            addDebugLog('Theme test passed', 'debug-success');
        }, 2000);
    } else {
        console.error('🔴 Theme functions not available');
        addDebugLog('Theme functions not available', 'debug-error');
    }
}

// ========== 初始化调试模式 ==========

function initDebugMode() {
    console.log('🐛 Debug mode initializing...');
    
    // 等待主脚本加载完成
    setTimeout(() => {
        // 运行初始诊断
        runFullDiagnostics();
        
        // 应用快速修复
        quickFixAll();
        
        // 设置定时更新
        setInterval(() => {
            updateDebugInfo();
            updateDebugErrorCount();
        }, 1000);
        
        console.log('✅ Debug mode initialized');
        addDebugLog('Debug mode initialized', 'debug-success');
    }, 1000);
}

// 在页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebugMode);
} else {
    initDebugMode();
}

// 导出调试函数到全局
window.debugFunctions = {
    runFullDiagnostics,
    checkDOMElements,
    checkSettings,
    checkTheme,
    quickFixAll,
    quickFixColorPicker,
    quickFixLiquidGlass,
    debugTestPopup,
    debugTestTheme,
    debugShowErrors
};

console.log('✅ Debug script loaded');
console.log('Available debug functions:', Object.keys(window.debugFunctions));
