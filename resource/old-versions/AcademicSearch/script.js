/*
LightSearch - 学术搜索模块
Copyright (C) 2025 Sails

本程序是自由软件：你可以根据GNU通用公共许可证第3版（或任何更新版本）的条款
重新分发和/或修改它。

本程序的分发是希望它能有用，但没有任何保证；甚至没有隐含的适销性或特定用途的保证。
详见GNU通用公共许可证。

你应该已经收到了GNU通用公共许可证的副本。如果没有，请参见<https://www.gnu.org/licenses/>。
*/

import { storage, themeUtils } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initAcademicEngines();
    themeUtils.init();
    initEventListeners();
});

// 初始化学术引擎
function initAcademicEngines() {
    const engines = storage.get('academicEngines') || [
        'https://scholar.google.com/scholar?q={query}',
        'https://pubmed.ncbi.nlm.nih.gov/?term={query}',
        'https://arxiv.org/search/?query={query}',
        'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText={query}'
    ];
    renderEngineList(engines);
    storage.set('academicEngines', engines);
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
    
    document.querySelectorAll('.delete-engine').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const engines = storage.get('academicEngines') || [];
            engines.splice(e.target.dataset.idx, 1);
            storage.set('academicEngines', engines);
            renderEngineList(engines);
        });
    });
}

// 执行学术搜索（带过滤条件）
function performAcademicSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return alert('请输入学术关键词');
    
    const timeFilter = document.getElementById('time-filter').value;
    const openAccess = document.getElementById('open-access').checked;
    const engines = storage.get('academicEngines') || [];
    
    // 构建带过滤参数的URL
    const urls = engines.map(engine => {
        let url = engine.replace('{query}', encodeURIComponent(query));
        // 谷歌学术时间过滤
        if (engine.includes('scholar.google.com') && timeFilter !== 'any') {
            const year = new Date().getFullYear() - parseInt(timeFilter);
            url += `&as_ylo=${year}`;
        }
        // 开放获取过滤（示例：arXiv）
        if (engine.includes('arxiv.org') && openAccess) {
            url += '&filter=all&searchtype=all';
        }
        return url;
    });
    
    urls.forEach(url => window.open(url, '_blank'));
}

// 初始化事件监听
function initEventListeners() {
    // 搜索触发
    document.getElementById('search-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') performAcademicSearch();
    });
    document.getElementById('search-button').addEventListener('click', performAcademicSearch);
    
    // 设置面板控制
    document.getElementById('settings-button-top').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'block';
    });
    document.querySelector('.settings-close').addEventListener('click', () => {
        document.getElementById('settings').style.display = 'none';
    });
    
    // 添加学术引擎
    document.getElementById('add-engine').addEventListener('click', () => {
        const engine = document.getElementById('new-engine').value.trim();
        if (engine && engine.includes('{query}')) {
            const engines = storage.get('academicEngines') || [];
            storage.set('academicEngines', [...new Set([...engines, engine])]);
            renderEngineList(storage.get('academicEngines'));
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
    
    // 背景设置
    document.getElementById('background-upload').addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                document.body.style.backgroundSize = 'cover';
                storage.set('academicBackground', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 链接跳转
    document.getElementById('Go-Github').addEventListener('click', () => {
        window.open('https://github.com/StarsailsClover/LightSearch', '_blank');
    });
    document.getElementById('Github-ISS').addEventListener('click', () => {
        window.open('https://github.com/StarsailsClover/LightSearch/issues', '_blank');
    });
}

