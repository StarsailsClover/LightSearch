document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('search-button').addEventListener('click', performSearch);

function performSearch() {
    const query = document.getElementById('search-input').value.trim(); // 获取用户输入
    if (query) {
        const urls = [
            `https://www.baidu.com/s?ie=utf-8&word=${encodeURIComponent(query)}`,
            `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            `https://magi.com/search?q=${encodeURIComponent(query)}`,
            `https://fsoufsou.com/search?q=${encodeURIComponent(query)}`,
            `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
            `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            `https://www.sogou.com/web?query=${encodeURIComponent(query)}`,
            `https://www.so.com/s?q=${encodeURIComponent(query)}`,
            `https://www.google.com/search?q=${encodeURIComponent(query)}` // 添加 Google 搜索
        ];

        // 在新标签页中打开所有搜索引擎
        urls.forEach(url => {
            window.open(url, '_blank');
        });
    } else {
        alert('请输入搜索内容'); // 提示用户输入内容
    }
}

const popup = document.getElementById('popup');
const settings = document.getElementById('settings');
const closePopup = document.querySelector('.close-button');
const settingsClose = document.querySelector('.settings-close');
const settingsButton = document.getElementById('settings-button');
const addEngineButton = document.getElementById('add-engine');
const engineList = document.getElementById('engine-list');
const toggleThemeButton = document.getElementById('toggle-theme');
let darkTheme = false;

// 初始弹出窗口
popup.style.display = 'flex';

// 关闭弹出窗口
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// 打开设置窗口
settingsButton.addEventListener('click', () => {
    settings.style.display = 'block';
});

// 关闭设置窗口
settingsClose.addEventListener('click', () => {
    settings.style.display = 'none';
});

// 添加搜索引擎
addEngineButton.addEventListener('click', () => {
    const newEngine = document.getElementById('new-engine').value;
    if (newEngine) {
        const li = document.createElement('li');
        li.textContent = newEngine;
        engineList.appendChild(li);
        document.getElementById('new-engine').value = '';
    }
});

// 切换主题
toggleThemeButton.addEventListener('click', () => {
    darkTheme = !darkTheme;
    document.body.classList.toggle('theme-dark', darkTheme);
});

document.getElementById('settings-button-top').addEventListener('click', () => {
    settings.style.display = 'block';
});

document.getElementById('background-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover'; // 可选：让背景图覆盖整个页面
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("Go-Github").onclick = function() {
    window.open("https://github.com", "_blank");
};

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Go-Github").onclick = function() {
        window.location.href = "https://github.com";
    };
});
