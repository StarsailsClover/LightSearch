document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 应用深色/浅色模式
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 应用上传的图片背景
    const savedBackground = localStorage.getItem('background-image');
    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover'; // 可选：让背景图覆盖整个页面
    }

    // 清空背景图片
document.getElementById('clear-background').addEventListener('click', () => {
    // 清除背景图片
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = ''; // 可选：清除背景图片大小设置

    // 从 localStorage 中移除背景图片
    localStorage.removeItem('background-image');

    // 重置文件输入框
    document.getElementById('background-upload').value = '';
});

    // 应用添加的APIs
    const savedEngines = JSON.parse(localStorage.getItem('engines')) || [];
    updateEngineList(savedEngines);

    // 检查是否首次访问
    const firstVisit = localStorage.getItem('firstVisit') === 'true';
    if (firstVisit) {
        showPopup();
    }
});

// 保存是否首次访问
if (!localStorage.getItem('firstVisit')) {
    localStorage.setItem('firstVisit', 'true');
} else {
    localStorage.setItem('firstVisit', 'false');
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    document.querySelector('.close-button').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

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
const popup_UpD = document.getElementById('popup_UpD');
const openButton = document.getElementById('open-popup-UpD');
const closeButton = document.getElementById('close-popup-UpD');
const closeButtonIcon = document.querySelector('.close-button');
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

// 保存添加的APIs
document.getElementById('add-engine').addEventListener('click', () => {
    const newEngine = document.getElementById('new-engine').value;
    if (newEngine) {
        const engines = JSON.parse(localStorage.getItem('engines')) || [];
        engines.push(newEngine);
        localStorage.setItem('engines', JSON.stringify(engines));
        // 更新UI
        updateEngineList(engines);
    }
});

// 更新搜索引擎列表UI
function updateEngineList(engines) {
    const engineList = document.getElementById('engine-list');
    engineList.innerHTML = '';
    engines.forEach(engine => {
        const li = document.createElement('li');
        li.textContent = engine;
        engineList.appendChild(li);
    });
}


// 切换主题
toggleThemeButton.addEventListener('click', () => {
    darkTheme = !darkTheme;
    document.body.classList.toggle('theme-dark', darkTheme);
});

// 打开设置菜单
document.getElementById('settings-button-top').addEventListener('click', () => {
    settings.style.display = 'block';
});

// 上传背景图片并处理
document.getElementById('background-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
                const averageColor = getAverageColor(imageData);

                // 根据平均颜色判断深色或浅色模式
                const isDark = isDarkColor(averageColor);
                const newTheme = isDark ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // 设置背景图片
                document.body.style.backgroundImage = `url(${e.target.result})`;
                document.body.style.backgroundSize = 'cover'; // 可选：让背景图覆盖整个页面
                localStorage.setItem('background-image', e.target.result);
            };
        };
        reader.readAsDataURL(file);
    }
});

// 计算平均颜色
function getAverageColor(imageData) {
    let rTotal = 0;
    let gTotal = 0;
    let bTotal = 0;
    const numPixels = imageData.length / 4;

    for (let i = 0; i < imageData.length; i += 4) {
        rTotal += imageData[i];
        gTotal += imageData[i + 1];
        bTotal += imageData[i + 2];
    }

    return {
        r: Math.floor(rTotal / numPixels),
        g: Math.floor(gTotal / numPixels),
        b: Math.floor(bTotal / numPixels)
    };
}

// 判断颜色是否为深色
function isDarkColor(color) {
    const { r, g, b } = color;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

// 打开模态框
openButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// 关闭模态框
closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

// 点击关闭按钮图标
closeButtonIcon.addEventListener('click', () => {
    popup.style.display = 'none';
});

// 点击模态框外部区域关闭
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
// 保存深色/浅色模式偏好
document.getElementById('toggle-theme').addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// 保存上传的图片背景
document.getElementById('background-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            localStorage.setItem('background-image', reader.result);
            document.body.style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// 打开GitHub页面
document.getElementById("Go-Github").onclick = function() {
    window.open("https://github.com", "_blank");
};

// 页面加载完成后绑定事件
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Go-Github").onclick = function() {
        window.location.href = "https://github.com/StarsailsClover/LightSearch";
    };
});

// 打开GitHub Issues页面
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Github-ISS").onclick = function() {
        window.location.href = "https://github.com/StarsailsClover/LightSearch/issues";
    };
});

