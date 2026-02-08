// ==================== 导航栏滚动效果 ====================
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 添加滚动样式
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// ==================== 滚动动画观察器 ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
animatedElements.forEach(el => observer.observe(el));

// ==================== 平滑滚动 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 48; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 视差滚动效果 ====================
const heroImage = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// ==================== 鼠标跟随效果（Hero 区域） ====================
const hero = document.querySelector('.hero');

if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = hero;
        
        const xPos = (clientX / offsetWidth - 0.5) * 20;
        const yPos = (clientY / offsetHeight - 0.5) * 20;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }
    });
    
    hero.addEventListener('mouseleave', () => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
        }
    });
}

// ==================== 卡片悬停效果增强 ====================
const cards = document.querySelectorAll('.feature-card, .theme-card, .tech-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        // 确保鼠标离开后恢复原状
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ==================== 性能优化：防抖函数 ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 懒加载图片 ====================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ==================== 页面加载完成后的动画 ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 预加载关键图片
    const criticalImages = document.querySelectorAll('.hero-image img, .split-image img');
    criticalImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});

// ==================== 移动端菜单切换 ====================
const createMobileMenu = () => {
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    // 创建汉堡菜单按钮
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    menuToggle.setAttribute('aria-label', '菜单');
    
    // 插入到导航栏
    if (window.innerWidth <= 1024) {
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.querySelector('.menu-toggle')) {
            navContainer.insertBefore(menuToggle, navActions);
        }
    }
    
    // 切换菜单
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // 点击菜单项后关闭菜单
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
};

// 响应式处理
const handleResize = debounce(() => {
    if (window.innerWidth <= 1024) {
        createMobileMenu();
    }
}, 250);

window.addEventListener('resize', handleResize);
handleResize();

// ==================== 滚动进度指示器 ====================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// ==================== 添加滚动进度条样式 ====================
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 48px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary), #00d4ff);
        z-index: 9999;
        transition: width 0.1s ease;
    }
    
    .menu-toggle {
        display: none;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
    }
    
    .menu-toggle span {
        width: 24px;
        height: 2px;
        background-color: var(--color-text-primary);
        transition: all 0.3s ease;
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 1024px) {
        .menu-toggle {
            display: flex;
        }
        
        .nav-menu {
            position: fixed;
            top: 48px;
            left: 0;
            right: 0;
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: saturate(180%) blur(20px);
            flex-direction: column;
            padding: var(--spacing-md);
            gap: var(--spacing-sm);
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
        }
        
        .nav-menu a {
            padding: var(--spacing-sm);
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }
        
        .nav-menu a:hover {
            background-color: var(--color-bg-gray);
        }
        
        body.menu-open {
            overflow: hidden;
        }
    }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ==================== 控制台彩蛋 ====================
console.log('%c🚀 LightSearch', 'font-size: 24px; font-weight: bold; color: #0071e3;');
console.log('%cSimple, Elegant, Powerful', 'font-size: 14px; color: #6e6e73;');
console.log('%cMade with ❤️ by Sails', 'font-size: 12px; color: #6e6e73;');
console.log('%cGitHub: https://github.com/StarsailsClover/LightSearch', 'font-size: 12px; color: #0071e3;');

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: 跳转到主应用
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = '../index.html';
    }
    
    // ESC: 关闭移动端菜单
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// ==================== 统计访问（可选） ====================
// 如果需要添加访问统计，可以在这里集成 Google Analytics 或其他统计工具
// 示例：
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'YOUR-GA-ID');
