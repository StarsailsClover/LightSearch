/*
 * 自定义UI组件库
 * 替换浏览器默认的select、input[type=color]等组件
 */

// ========== 自定义选择器 ==========
class CustomSelect {
    constructor(selectElement) {
        this.select = selectElement;
        this.options = Array.from(selectElement.options);
        this.selectedIndex = selectElement.selectedIndex;
        this.isOpen = false;
        
        this.createCustomSelect();
        this.bindEvents();
    }
    
    createCustomSelect() {
        // 创建自定义选择器容器
        this.container = document.createElement('div');
        this.container.className = 'custom-select';
        
        // 创建显示区域
        this.display = document.createElement('div');
        this.display.className = 'custom-select-display';
        this.display.innerHTML = `
            <span class="custom-select-value">${this.options[this.selectedIndex].text}</span>
            <span class="custom-select-arrow">▼</span>
        `;
        
        // 创建选项列表
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-select-dropdown';
        this.dropdown.innerHTML = this.options.map((opt, idx) => `
            <div class="custom-select-option ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
                ${opt.text}
            </div>
        `).join('');
        
        this.container.appendChild(this.display);
        this.container.appendChild(this.dropdown);
        
        // 替换原生select
        this.select.style.display = 'none';
        this.select.parentNode.insertBefore(this.container, this.select);
    }
    
    bindEvents() {
        // 点击显示区域
        this.display.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // 点击选项
        this.dropdown.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(opt.dataset.index);
                this.selectOption(index);
            });
        });
        
        // 点击外部关闭
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.dropdown.style.display = 'block';
    }
    
    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
        this.dropdown.style.display = 'none';
    }
    
    selectOption(index) {
        this.selectedIndex = index;
        this.select.selectedIndex = index;
        
        // 更新显示
        this.display.querySelector('.custom-select-value').textContent = this.options[index].text;
        
        // 更新选中状态
        this.dropdown.querySelectorAll('.custom-select-option').forEach((opt, idx) => {
            opt.classList.toggle('selected', idx === index);
        });
        
        // 触发change事件
        this.select.dispatchEvent(new Event('change', { bubbles: true }));
        
        this.close();
    }
}

// ========== 自定义调色盘 ==========
class CustomColorPicker {
    constructor(inputElement) {
        this.input = inputElement;
        this.color = inputElement.value || '#4285f4';
        this.isOpen = false;
        
        this.createColorPicker();
        this.bindEvents();
    }
    
    createColorPicker() {
        // 创建容器
        this.container = document.createElement('div');
        this.container.className = 'custom-color-picker';
        
        // 创建显示按钮
        this.button = document.createElement('button');
        this.button.className = 'custom-color-button';
        this.button.type = 'button';
        this.button.innerHTML = `
            <span class="custom-color-preview" style="background-color: ${this.color}"></span>
            <span class="custom-color-value">${this.color}</span>
        `;
        
        // 创建调色盘弹窗
        this.modal = document.createElement('div');
        this.modal.className = 'custom-color-modal';
        this.modal.innerHTML = `
            <div class="custom-color-modal-content">
                <div class="custom-color-modal-header">
                    <h4>选择颜色</h4>
                    <button class="custom-color-close">&times;</button>
                </div>
                <div class="custom-color-modal-body">
                    <div class="custom-color-canvas-container">
                        <canvas class="custom-color-canvas" width="280" height="280"></canvas>
                        <div class="custom-color-cursor"></div>
                    </div>
                    <div class="custom-color-hue-container">
                        <canvas class="custom-color-hue" width="30" height="280"></canvas>
                        <div class="custom-color-hue-cursor"></div>
                    </div>
                    <div class="custom-color-preview-large" style="background-color: ${this.color}"></div>
                </div>
                <div class="custom-color-modal-footer">
                    <input type="text" class="custom-color-input" value="${this.color}" placeholder="#000000">
                    <div class="custom-color-actions">
                        <button class="custom-color-cancel">取消</button>
                        <button class="custom-color-confirm">确认</button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.button);
        document.body.appendChild(this.modal);
        
        // 替换原生input
        this.input.style.display = 'none';
        this.input.parentNode.insertBefore(this.container, this.input);
        
        // 初始化画布
        this.initCanvas();
    }
    
    initCanvas() {
        this.canvas = this.modal.querySelector('.custom-color-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hueCanvas = this.modal.querySelector('.custom-color-hue');
        this.hueCtx = this.hueCanvas.getContext('2d');
        
        this.drawHueBar();
        this.drawColorCanvas(0);
    }
    
    drawHueBar() {
        const gradient = this.hueCtx.createLinearGradient(0, 0, 0, 280);
        for (let i = 0; i <= 6; i++) {
            gradient.addColorStop(i / 6, `hsl(${i * 60}, 100%, 50%)`);
        }
        this.hueCtx.fillStyle = gradient;
        this.hueCtx.fillRect(0, 0, 30, 280);
    }
    
    drawColorCanvas(hue) {
        // 绘制饱和度和亮度渐变
        const gradient1 = this.ctx.createLinearGradient(0, 0, 280, 0);
        gradient1.addColorStop(0, '#ffffff');
        gradient1.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
        this.ctx.fillStyle = gradient1;
        this.ctx.fillRect(0, 0, 280, 280);
        
        const gradient2 = this.ctx.createLinearGradient(0, 0, 0, 280);
        gradient2.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.ctx.fillStyle = gradient2;
        this.ctx.fillRect(0, 0, 280, 280);
    }
    
    bindEvents() {
        // 点击按钮打开
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.open();
        });
        
        // 关闭按钮
        this.modal.querySelector('.custom-color-close').addEventListener('click', () => {
            this.close();
        });
        
        // 取消按钮
        this.modal.querySelector('.custom-color-cancel').addEventListener('click', () => {
            this.close();
        });
        
        // 确认按钮
        this.modal.querySelector('.custom-color-confirm').addEventListener('click', () => {
            this.confirm();
        });
        
        // 点击画布
        this.canvas.addEventListener('click', (e) => {
            this.pickColor(e);
        });
        
        // 点击色相条
        this.hueCanvas.addEventListener('click', (e) => {
            this.pickHue(e);
        });
        
        // 输入框
        const input = this.modal.querySelector('.custom-color-input');
        input.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                this.color = color;
                this.updatePreview();
            }
        });
    }
    
    open() {
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    confirm() {
        this.input.value = this.color;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.updateButton();
        this.close();
    }
    
    pickColor(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const imageData = this.ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        
        this.color = this.rgbToHex(r, g, b);
        this.updatePreview();
        
        // 移动光标
        const cursor = this.modal.querySelector('.custom-color-cursor');
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    }
    
    pickHue(e) {
        const rect = this.hueCanvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hue = (y / 280) * 360;
        
        this.drawColorCanvas(hue);
        
        // 移动光标
        const cursor = this.modal.querySelector('.custom-color-hue-cursor');
        cursor.style.top = y + 'px';
    }
    
    updatePreview() {
        this.modal.querySelector('.custom-color-preview-large').style.backgroundColor = this.color;
        this.modal.querySelector('.custom-color-input').value = this.color;
    }
    
    updateButton() {
        this.button.querySelector('.custom-color-preview').style.backgroundColor = this.color;
        this.button.querySelector('.custom-color-value').textContent = this.color;
    }
    
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}

// ========== 自定义开关 ==========
class CustomSwitch {
    constructor(checkboxElement) {
        this.checkbox = checkboxElement;
        this.checked = checkboxElement.checked;
        
        this.createSwitch();
        this.bindEvents();
    }
    
    createSwitch() {
        // 如果已经有父级 .ls-switch，直接使用
        if (this.checkbox.closest('.ls-switch')) {
            this.container = this.checkbox.closest('.ls-switch');
            return;
        }
        
        // 创建开关容器
        this.container = document.createElement('label');
        this.container.className = 'custom-switch';
        
        // 创建滑块
        this.slider = document.createElement('span');
        this.slider.className = 'custom-switch-slider';
        
        this.container.appendChild(this.checkbox);
        this.container.appendChild(this.slider);
        
        // 替换原位置
        this.checkbox.parentNode.insertBefore(this.container, this.checkbox);
        this.container.appendChild(this.checkbox);
    }
    
    bindEvents() {
        this.checkbox.addEventListener('change', () => {
            this.checked = this.checkbox.checked;
            this.updateState();
        });
    }
    
    updateState() {
        this.container.classList.toggle('checked', this.checked);
    }
}

// ========== 自动初始化自定义组件 ==========
function initCustomComponents() {
    // 初始化所有select
    document.querySelectorAll('select:not(.custom-select-initialized)').forEach(select => {
        if (!select.classList.contains('ls-select')) return; // 只处理特定的select
        new CustomSelect(select);
        select.classList.add('custom-select-initialized');
    });
    
    // 初始化所有color input
    document.querySelectorAll('input[type="color"]:not(.custom-color-initialized)').forEach(input => {
        new CustomColorPicker(input);
        input.classList.add('custom-color-initialized');
    });
    
    // 初始化所有checkbox (开关样式)
    document.querySelectorAll('input[type="checkbox"]:not(.custom-switch-initialized)').forEach(checkbox => {
        if (checkbox.closest('.ls-switch') || checkbox.closest('.custom-switch')) {
            new CustomSwitch(checkbox);
            checkbox.classList.add('custom-switch-initialized');
        }
    });
}

// ========== 自定义组件样式 ==========
const customComponentsStyles = `
<style id="custom-components-styles">
    /* 自定义选择器 */
    .custom-select {
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 150px;
    }
    
    .custom-select-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        background: var(--ls-card-bg);
        border: 1px solid var(--ls-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .custom-select-display:hover {
        border-color: var(--ls-accent);
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
    }
    
    .custom-select.open .custom-select-display {
        border-color: var(--ls-accent);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    
    .custom-select-arrow {
        transition: transform 0.2s ease;
        color: #666;
    }
    
    .custom-select.open .custom-select-arrow {
        transform: rotate(180deg);
    }
    
    .custom-select-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--ls-card-bg);
        border: 1px solid var(--ls-accent);
        border-top: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .custom-select-option {
        padding: 10px 15px;
        cursor: pointer;
        transition: background 0.2s ease;
    }
    
    .custom-select-option:hover {
        background: rgba(66, 133, 244, 0.1);
    }
    
    .custom-select-option.selected {
        background: rgba(66, 133, 244, 0.2);
        color: var(--ls-accent);
        font-weight: 500;
    }
    
    /* 自定义调色盘 */
    .custom-color-button {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: var(--ls-card-bg);
        border: 1px solid var(--ls-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .custom-color-button:hover {
        border-color: var(--ls-accent);
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
    }
    
    .custom-color-preview {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    
    .custom-color-value {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: var(--ls-text);
    }
    
    .custom-color-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }
    
    .custom-color-modal.active {
        display: flex;
    }
    
    .custom-color-modal-content {
        background: var(--ls-card-bg);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 400px;
        max-width: 90vw;
    }
    
    .custom-color-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--ls-border);
    }
    
    .custom-color-modal-header h4 {
        margin: 0;
        color: var(--ls-text);
    }
    
    .custom-color-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .custom-color-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #000;
    }
    
    .custom-color-modal-body {
        padding: 20px;
        display: flex;
        gap: 15px;
    }
    
    .custom-color-canvas-container {
        position: relative;
        width: 280px;
        height: 280px;
    }
    
    .custom-color-canvas {
        border-radius: 8px;
        cursor: crosshair;
    }
    
    .custom-color-cursor {
        position: absolute;
        width: 12px;
        height: 12px;
        border: 2px solid #fff;
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
        transform: translate(-50%, -50%);
    }
    
    .custom-color-hue-container {
        position: relative;
        width: 30px;
        height: 280px;
    }
    
    .custom-color-hue {
        border-radius: 4px;
        cursor: pointer;
    }
    
    .custom-color-hue-cursor {
        position: absolute;
        left: -2px;
        width: 34px;
        height: 4px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.3);
        pointer-events: none;
        transform: translateY(-50%);
    }
    
    .custom-color-preview-large {
        width: 50px;
        height: 280px;
        border-radius: 8px;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    
    .custom-color-modal-footer {
        padding: 20px;
        border-top: 1px solid var(--ls-border);
    }
    
    .custom-color-input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--ls-border);
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        margin-bottom: 15px;
        background: var(--ls-card-bg);
        color: var(--ls-text);
    }
    
    .custom-color-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    
    .custom-color-cancel,
    .custom-color-confirm {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .custom-color-cancel {
        background: #e0e0e0;
        color: #333;
    }
    
    .custom-color-cancel:hover {
        background: #d0d0d0;
    }
    
    .custom-color-confirm {
        background: var(--ls-accent);
        color: white;
    }
    
    .custom-color-confirm:hover {
        background: #3367d6;
    }
    
    /* 自定义开关 */
    .custom-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }
    
    .custom-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .custom-switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.3s;
        border-radius: 24px;
    }
    
    .custom-switch-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .custom-switch input:checked + .custom-switch-slider {
        background-color: var(--ls-accent);
    }
    
    .custom-switch input:checked + .custom-switch-slider:before {
        transform: translateX(26px);
    }
    
    .custom-switch.checked .custom-switch-slider {
        background-color: var(--ls-accent);
    }
    
    .custom-switch.checked .custom-switch-slider:before {
        transform: translateX(26px);
    }
</style>
`;

// 添加样式到页面
document.head.insertAdjacentHTML('beforeend', customComponentsStyles);

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomComponents);
} else {
    initCustomComponents();
}

// 监听DOM变化，自动初始化新添加的组件
const observer = new MutationObserver(() => {
    initCustomComponents();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('✅ Custom UI components loaded');
