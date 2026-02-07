/*
 * LightSearch 综合修复与增强脚本 v2.0
 * 修复所有已知问题并添加新功能
 */

// ========== 错误监视器和错误码体系 ==========
const ErrorMonitor = {
    errors: [],
    errorCodes: {
        // 1xxx: 初始化错误
        E1001: '页面初始化失败',
        E1002: 'DOM元素未找到',
        E1003: '本地存储不可用',
        
        // 2xxx: 设置相关错误
        E2001: '设置加载失败',
        E2002: '设置保存失败',
        E2003: '无效的设置值',
        
        // 3xxx: 搜索引擎错误
        E3001: '搜索引擎列表为空',
        E3002: '无效的搜索引擎URL',
        E3003: '搜索引擎添加失败',
        
        // 4xxx: 国际化错误
        E4001: '语言文件加载失败',
        E4002: '翻译键缺失',
        E4003: '语言切换失败',
        
        // 5xxx: 主题相关错误
        E5001: '主题加载失败',
        E5002: '主题应用失败',
        E5003: 'LiquidGlass初始化失败',
        
        // 6xxx: 文件上传错误
        E6001: '文件读取失败',
        E6002: '不支持的文件格式',
        E6003: '文件大小超限',
        
        // 7xxx: 搜索功能错误
        E7001: '搜索执行失败',
        E7002: '历史记录保存失败',
        E7003: '历史记录加载失败'
    },
    
    log(code, message, details = null) {
        const error = {
            code,
            message: this.errorCodes[code] || '未知错误',
            customMessage: message,
            details,
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        };
        
        this.errors.push(error);
        console.error(`[${code}] ${error.message}:`, message, details);
        
        // 保存到本地存储
        try {
            const savedErrors = JSON.parse(localStorage.getItem('ls-error-log') || '[]');
            savedErrors.push(error);
            // 只保留最近100条错误
            if (savedErrors.length > 100) {
                savedErrors.shift();
            }
            localStorage.setItem('ls-error-log', JSON.stringify(savedErrors));
        } catch (e) {
            console.error('无法保存错误日志:', e);
        }
    },
    
    getErrors() {
        return this.errors;
    },
    
    clearErrors() {
        this.errors = [];
        try {
            localStorage.removeItem('ls-error-log');
        } catch (e) {
            console.error('无法清除错误日志:', e);
        }
    },
    
    getErrorLog() {
        try {
            return JSON.parse(localStorage.getItem('ls-error-log') || '[]');
        } catch (e) {
            return [];
        }
    }
};

// 全局错误处理
window.addEventListener('error', (event) => {
    ErrorMonitor.log('E1001', '全局错误', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorMonitor.log('E1001', 'Promise拒绝未处理', {
        reason: event.reason
    });
});

// ========== LiquidGlass 增强实现 ==========
class LiquidGlassEffect {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.isInitialized = false;
        this.animationId = null;
        this.isDarkMode = false;
        this.sunAngle = 0;
        this.lightIntensity = 1.0;
    }
    
    init() {
        try {
            // 创建 canvas
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'liquidglass-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.insertBefore(this.canvas, document.body.firstChild);
            
            // 初始化 WebGL
            this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true }) 
                   || this.canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
            
            if (!this.gl) {
                throw new Error('WebGL not supported');
            }
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // 编译着色器
            this.compileShaders();
            
            // 计算太阳/月亮角度
            this.updateSunAngle();
            setInterval(() => this.updateSunAngle(), 60000); // 每分钟更新一次
            
            this.isInitialized = true;
            this.startAnimation();
            
            console.log('✨ LiquidGlass effect initialized');
        } catch (error) {
            ErrorMonitor.log('E5003', 'LiquidGlass初始化失败', error);
            console.error('LiquidGlass init failed:', error);
        }
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    compileShaders() {
        // 简化版着色器（完整版太长，这里是基础实现）
        const vertexShaderSrc = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
        
        const fragmentShaderSrc = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_lightAngle;
            uniform float u_lightIntensity;
            uniform bool u_darkMode;
            varying vec2 v_uv;
            
            void main() {
                vec2 uv = v_uv;
                
                // 基础玻璃效果
                float brightness = u_darkMode ? 0.1 : 0.95;
                vec3 glassColor = vec3(brightness);
                
                // 根据光照角度添加渐变
                float gradient = sin(uv.y * 3.14159 + u_lightAngle) * 0.5 + 0.5;
                glassColor += vec3(gradient * 0.1 * u_lightIntensity);
                
                // 添加微妙的噪声
                float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
                glassColor += vec3(noise * 0.02);
                
                gl_FragColor = vec4(glassColor, 0.95);
            }
        `;
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Program link failed');
        }
        
        this.gl.useProgram(this.program);
        
        // 设置顶点
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    updateSunAngle() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeInHours = hours + minutes / 60;
        
        // 6:00 = 0度 (日出), 12:00 = 90度 (正午), 18:00 = 180度 (日落)
        // 0:00-6:00 和 18:00-24:00 是夜晚
        if (timeInHours >= 6 && timeInHours <= 18) {
            // 白天
            this.sunAngle = ((timeInHours - 6) / 12) * Math.PI;
            this.lightIntensity = Math.sin(this.sunAngle) * 0.5 + 0.5;
            this.isDarkMode = false;
        } else {
            // 夜晚
            this.sunAngle = Math.PI;
            this.lightIntensity = 0.2;
            this.isDarkMode = true;
        }
    }
    
    startAnimation() {
        const animate = (time) => {
            if (!this.isInitialized) return;
            
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            
            // 更新 uniforms
            const u_resolution = this.gl.getUniformLocation(this.program, 'u_resolution');
            const u_time = this.gl.getUniformLocation(this.program, 'u_time');
            const u_lightAngle = this.gl.getUniformLocation(this.program, 'u_lightAngle');
            const u_lightIntensity = this.gl.getUniformLocation(this.program, 'u_lightIntensity');
            const u_darkMode = this.gl.getUniformLocation(this.program, 'u_darkMode');
            
            this.gl.uniform2f(u_resolution, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(u_time, time * 0.001);
            this.gl.uniform1f(u_lightAngle, this.sunAngle);
            this.gl.uniform1f(u_lightIntensity, this.lightIntensity);
            this.gl.uniform1i(u_darkMode, this.isDarkMode ? 1 : 0);
            
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    setDarkMode(isDark) {
        this.isDarkMode = isDark;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.isInitialized = false;
    }
}

// 全局 LiquidGlass 实例
let liquidGlassEffect = null;

// ========== 搜索历史删除功能 ==========
function deleteHistoryItem(query) {
    settings.history = settings.history.filter(item => item !== query);
    storage.set('history', settings.history);
    renderHistory();
}

function clearAllHistory() {
    if (confirm(t('clearHistoryConfirm') || '确定要清除所有搜索历史吗？')) {
        settings.history = [];
        storage.set('history', settings.history);
        renderHistory();
    }
}

// ========== 显示模式管理（替代黑暗模式） ==========
const DisplayModeManager = {
    mode: 'manual', // 'manual' or 'auto'
    isDark: false,
    autoSwitchTimes: {
        light: 6, // 6:00 切换到明亮模式
        dark: 18  // 18:00 切换到黑暗模式
    },
    checkInterval: null,
    
    init() {
        const savedMode = storage.get('displayMode') || 'manual';
        const savedIsDark = storage.get('darkMode') || false;
        const savedTimes = storage.get('autoSwitchTimes') || this.autoSwitchTimes;
        
        this.mode = savedMode;
        this.isDark = savedIsDark;
        this.autoSwitchTimes = savedTimes;
        
        if (this.mode === 'auto') {
            this.startAutoSwitch();
        }
        
        this.apply();
    },
    
    setMode(mode) {
        this.mode = mode;
        storage.set('displayMode', mode);
        
        if (mode === 'auto') {
            this.startAutoSwitch();
            this.checkAndSwitch();
        } else {
            this.stopAutoSwitch();
        }
    },
    
    setDarkMode(isDark) {
        this.isDark = isDark;
        storage.set('darkMode', isDark);
        this.apply();
    },
    
    setAutoSwitchTimes(lightHour, darkHour) {
        this.autoSwitchTimes = { light: lightHour, dark: darkHour };
        storage.set('autoSwitchTimes', this.autoSwitchTimes);
    },
    
    startAutoSwitch() {
        this.stopAutoSwitch();
        this.checkInterval = setInterval(() => {
            this.checkAndSwitch();
        }, 60000); // 每分钟检查一次
    },
    
    stopAutoSwitch() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },
    
    checkAndSwitch() {
        const now = new Date();
        const currentHour = now.getHours();
        
        const shouldBeDark = currentHour >= this.autoSwitchTimes.dark || 
                            currentHour < this.autoSwitchTimes.light;
        
        if (shouldBeDark !== this.isDark) {
            this.setDarkMode(shouldBeDark);
        }
    },
    
    apply() {
        document.body.classList.toggle('theme-dark', this.isDark);
        
        // 如果是 LiquidGlass 模式，只调整亮度和文字颜色
        if (settings.theme === 'liquid-glass') {
            if (liquidGlassEffect) {
                liquidGlassEffect.setDarkMode(this.isDark);
            }
            
            // 调整文字颜色
            document.documentElement.style.setProperty(
                '--ls-text', 
                this.isDark ? '#ffffff' : '#000000'
            );
            
            // 不修改背景颜色，保持透明
            document.documentElement.style.setProperty('--ls-bg', 'transparent');
            document.documentElement.style.setProperty('--ls-card-bg', 'rgba(255, 255, 255, 0.1)');
        } else {
            // Classic 主题正常切换
            if (this.isDark) {
                document.documentElement.style.setProperty('--ls-bg', '#1a1a1a');
                document.documentElement.style.setProperty('--ls-text', '#ffffff');
                document.documentElement.style.setProperty('--ls-card-bg', '#2a2a2a');
            } else {
                document.documentElement.style.setProperty('--ls-bg', '#ffffff');
                document.documentElement.style.setProperty('--ls-text', '#000000');
                document.documentElement.style.setProperty('--ls-card-bg', '#ffffff');
            }
        }
    }
};

// ========== 图片裁剪功能 ==========
class ImageCropper {
    constructor() {
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.cropArea = { x: 0, y: 0, width: 0, height: 0 };
        this.isDragging = false;
        this.callback = null;
    }
    
    open(imageFile, aspectRatio, callback) {
        this.callback = callback;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.image = new Image();
            this.image.onload = () => {
                this.createModal(aspectRatio);
                this.drawImage();
            };
            this.image.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }
    
    createModal(aspectRatio) {
        // 创建模态框
        this.modal = document.createElement('div');
        this.modal.className = 'image-cropper-modal';
        this.modal.innerHTML = `
            <div class="image-cropper-content">
                <h3>${t('cropImage') || '裁剪图片'}</h3>
                <canvas id="cropCanvas"></canvas>
                <div class="image-cropper-controls">
                    <button class="ls-btn ls-btn--secondary" onclick="imageCropper.cancel()">${t('cancelButton')}</button>
                    <button class="ls-btn ls-btn--primary" onclick="imageCropper.confirm()">${t('confirmButton') || '确认'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        this.canvas = document.getElementById('cropCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置 canvas 大小
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.6;
        
        let canvasWidth = this.image.width;
        let canvasHeight = this.image.height;
        
        if (canvasWidth > maxWidth) {
            canvasHeight = (maxWidth / canvasWidth) * canvasHeight;
            canvasWidth = maxWidth;
        }
        
        if (canvasHeight > maxHeight) {
            canvasWidth = (maxHeight / canvasHeight) * canvasWidth;
            canvasHeight = maxHeight;
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // 初始化裁剪区域
        const cropWidth = Math.min(canvasWidth * 0.8, canvasHeight * aspectRatio);
        const cropHeight = cropWidth / aspectRatio;
        
        this.cropArea = {
            x: (canvasWidth - cropWidth) / 2,
            y: (canvasHeight - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight
        };
        
        // 绑定事件
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    }
    
    drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制图片
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制遮罩
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 清除裁剪区域
        this.ctx.clearRect(
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
        
        // 重新绘制裁剪区域的图片
        this.ctx.drawImage(
            this.image,
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
        
        // 绘制裁剪框
        this.ctx.strokeStyle = '#4285f4';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否在裁剪区域内
        if (x >= this.cropArea.x && x <= this.cropArea.x + this.cropArea.width &&
            y >= this.cropArea.y && y <= this.cropArea.y + this.cropArea.height) {
            this.isDragging = true;
            this.dragStartX = x - this.cropArea.x;
            this.dragStartY = y - this.cropArea.y;
        }
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.cropArea.x = Math.max(0, Math.min(x - this.dragStartX, this.canvas.width - this.cropArea.width));
        this.cropArea.y = Math.max(0, Math.min(y - this.dragStartY, this.canvas.height - this.cropArea.height));
        
        this.drawImage();
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    confirm() {
        // 创建裁剪后的图片
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = this.cropArea.width;
        croppedCanvas.height = this.cropArea.height;
        
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(
            this.canvas,
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height,
            0,
            0,
            this.cropArea.width,
            this.cropArea.height
        );
        
        const croppedImage = croppedCanvas.toDataURL('image/png');
        
        if (this.callback) {
            this.callback(croppedImage);
        }
        
        this.close();
    }
    
    cancel() {
        this.close();
    }
    
    close() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
    }
}

const imageCropper = new ImageCropper();

console.log('✅ 综合修复脚本已加载');
