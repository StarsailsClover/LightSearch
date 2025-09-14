/*
LightSearch - 多引擎搜索工具
Copyright (C) 2025 Sails

本程序是自由软件：你可以根据GNU通用公共许可证第3版（或任何更新版本）的条款
重新分发和/或修改它。

本程序的分发是希望它能有用，但没有任何保证；甚至没有隐含的适销性或特定用途的保证。
详见GNU通用公共许可证。

你应该已经收到了GNU通用公共许可证的副本。如果没有，请参见<https://www.gnu.org/licenses/>。
*/

import { storage, themeUtils, historyUtils } from './utils.js';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initSearchEngines();
    themeUtils.init();
    historyUtils.render('search-history');
    loadBackground();
    initEventListeners();
});

// 初始化搜索引擎列表
function initSearchEngines() {
    const engines = storage.get('engines') || [
        'https://www.baidu.com/s?ie=utf-8&word={query}',
        'https://www.bing.com/search?q={query}',
        'https://www.google.com/search?q={query}'
    ];
    renderEngineList(engines);
    storage.set('engines', engines);
}

// 渲染引擎列表
function renderEngineList(engines) {
    const list = document.getElementById('engine-list');
    list.innerHTML = engines.map((engine, idx) => `
        <li>
            ${engine}
            <button class="delete-engine" data-idx="${idx}">删除</button>
        </li>
    `).join('');
    
    // 绑定删除事件
    document.querySelectorAll('.delete-engine').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const engines = storage.get('engines') || [];
            engines.splice(e.target.dataset.idx, 1);
            storage.set('engines', engines);
            renderEngineList(engines);
        });
    });
}

// 执行搜索
function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return alert('请输入搜索内容');
    
    // 保存搜索历史
    historyUtils.add(query);
    historyUtils.render('search-history');
    
    // 构建搜索URL
    const engines = storage.get('engines') || [];
    const urls = engines.map(engine => 
        engine.replace('{query}', encodeURIComponent(query))
    );
    
    // 打开所有引擎
    urls.forEach(url => window.open(url, '_blank'));
}

// 加载背景设置
function loadBackground() {
    const bg = storage.get('background');
    if (bg) {
        document.body.style.backgroundImage = `url(${bg.url})`;
        document.body.style.backgroundSize = 'cover';
        document.getElementById('bg-blur').value = bg.blur || 0;
        document.body.style.backdropFilter = `blur(${bg.blur}px)`;
    }
}

// 初始化事件监听
function initEventListeners() {
    // 搜索触发
    document.getElementById('search-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('search-button').addEventListener('click', performSearch);
    
    // 设置面板控制
    document.getElementById('settings-button').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'block';
    });
    document.querySelector('.settings-close').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'none';
    });
    
    // 添加引擎
    document.getElementById('add-engine').addEventListener('click', () => {
        const engine = document.getElementById('new-engine').value.trim();
        if (engine && engine.includes('{query}')) {
            const engines = storage.get('engines') || [];
            storage.set('engines', [...new Set([...engines, engine])]);
            renderEngineList(storage.get('engines'));
            document.getElementById('new-engine').value = '';
        } else {
            alert('请包含{query}作为关键词占位符');
        }
    });
    
    // 主题切换
    document.getElementById('toggle-theme').addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        storage.set('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });
    document.getElementById('theme-preset').addEventListener('change', e => {
        themeUtils.applyPreset(e.target.value);
    });
    
    // 背景设置
    document.getElementById('background-upload').addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const blur = document.getElementById('bg-blur').value;
                storage.set('background', { url: e.target.result, blur });
                loadBackground();
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('clear-background').addEventListener('click', () => {
        storage.remove('background');
        document.body.style.backgroundImage = 'none';
        document.body.style.backdropFilter = 'none';
    });
    document.getElementById('bg-blur').addEventListener('input', e => {
        const bg = storage.get('background');
        if (bg) {
            bg.blur = e.target.value;
            storage.set('background', bg);
            document.body.style.backdropFilter = `blur(${bg.blur}px)`;
        }
    });
    
    // 链接跳转
    document.getElementById('Go-Github').addEventListener('click', () => {
        window.open('https://github.com/StarsailsClover/LightSearch', '_blank');
    });
    document.getElementById('Github-ISS').addEventListener('click', () => {
        window.open('https://github.com/StarsailsClover/LightSearch/issues', '_blank');
    });
    
    // 快捷键支持
    document.addEventListener('keydown', e => {
        // Ctrl+/ 聚焦搜索框
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
        // Esc 关闭设置面板
        if (e.key === 'Escape') {
            document.getElementById('settings').style.display = 'none';
        }
    });
}
