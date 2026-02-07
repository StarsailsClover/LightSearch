/*
LightSearch - 弹窗管理系统
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

export class PopupManager {
    constructor() {
        this.activePopups = new Set();
        this.popups = new Map();
        this.initOverlay();
    }

    // 创建全局遮罩层
    initOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'ls-popup-overlay';
        this.overlay.addEventListener('click', () => this.closeAll());
        document.body.appendChild(this.overlay);
    }

    // 注册弹窗
    register(name, element) {
        this.popups.set(name, element);
        element.classList.add('ls-popup');
        element.dataset.popup = name;

        // 查找关闭按钮
        const closeBtn = element.querySelector('.js-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close(name));
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activePopups.has(name)) {
                this.close(name);
            }
        });
    }

    // 打开弹窗
    open(name, options = {}) {
        const popup = this.popups.get(name);
        if (!popup) {
            console.error(`Popup "${name}" not found`);
            return;
        }

        // 关闭其他弹窗（如果需要）
        if (options.exclusive !== false) {
            this.closeAll();
        }

        // 显示遮罩层
        this.overlay.classList.add('is-active');

        // 显示弹窗（使用 RAF 确保过渡效果）
        requestAnimationFrame(() => {
            popup.classList.add('is-active');
            this.activePopups.add(name);
            
            // 聚焦第一个输入框
            const firstInput = popup.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }

            // 触发事件
            popup.dispatchEvent(new CustomEvent('popupOpened', { detail: { name } }));
        });

        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }

    // 关闭弹窗
    close(name) {
        const popup = this.popups.get(name);
        if (!popup) return;

        popup.classList.remove('is-active');
        this.activePopups.delete(name);

        // 如果没有活动弹窗，隐藏遮罩层
        if (this.activePopups.size === 0) {
            this.overlay.classList.remove('is-active');
            document.body.style.overflow = '';
        }

        // 触发事件
        popup.dispatchEvent(new CustomEvent('popupClosed', { detail: { name } }));
    }

    // 关闭所有弹窗
    closeAll() {
        this.activePopups.forEach(name => this.close(name));
    }

    // 切换弹窗
    toggle(name) {
        if (this.activePopups.has(name)) {
            this.close(name);
        } else {
            this.open(name);
        }
    }

    // 检查弹窗是否打开
    isOpen(name) {
        return this.activePopups.has(name);
    }
}

// 单例模式
export const popupManager = new PopupManager();
