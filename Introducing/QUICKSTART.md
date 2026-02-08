# 🚀 快速启动指南

## 本地预览

### 方法 1：直接打开
双击 `index.html` 文件即可在浏览器中打开

### 方法 2：使用本地服务器（推荐）

#### Python 3
```bash
cd Introducing
python -m http.server 8000
```
然后访问：http://localhost:8000

#### Node.js (http-server)
```bash
npm install -g http-server
cd Introducing
http-server -p 8000
```
然后访问：http://localhost:8000

#### VS Code Live Server
1. 安装 Live Server 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 部署到 GitHub Pages

### 选项 1：作为子目录
当前结构已经可以直接部署，访问路径为：
```
https://yourusername.github.io/LightSearch/Introducing/
```

### 选项 2：独立仓库
1. 创建新仓库 `LightSearch-Intro`
2. 将 `Introducing` 目录内容推送到仓库
3. 启用 GitHub Pages
4. 访问：`https://yourusername.github.io/LightSearch-Intro/`

## 自定义配置

### 修改品牌信息
编辑 `index.html`：
- 第 9 行：页面标题
- 第 10-11 行：SEO 描述和关键词
- 第 15-17 行：Open Graph 信息

### 修改颜色主题
编辑 `styles.css` 的 `:root` 部分：
```css
:root {
    --color-primary: #0071e3;  /* 主色调 */
    --color-primary-hover: #0077ed;  /* 悬停色 */
    /* ... */
}
```

### 替换图片
将以下图片替换为你的实际截图：
- `../slide_01_cover.png` - Hero 区域主图
- `../slide_03_mult-engine.png` - 多引擎搜索
- `../slide_04_academic.png` - 学术搜索
- `../slide_06_responsive.png` - 响应式设计
- `../slide_07_themes.png` - 主题展示
- `../slide_08_customization.png` - 自定义功能

### 修改链接
编辑 `index.html` 中的链接：
- GitHub 仓库链接
- 在线演示链接
- 下载链接

## 性能优化建议

### 图片优化
```bash
# 使用 ImageOptim、TinyPNG 或命令行工具压缩图片
# 推荐格式：WebP（带 PNG/JPG 回退）
```

### 添加 WebP 支持
```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.png" alt="描述">
</picture>
```

### 启用 Gzip/Brotli 压缩
在服务器配置中启用压缩（GitHub Pages 自动支持）

### 添加 CDN
考虑使用 Cloudflare 等 CDN 加速访问

## 浏览器测试清单

- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）
- [ ] 移动端 Safari（iOS）
- [ ] 移动端 Chrome（Android）

## 响应式测试断点

- [ ] 1920px（大屏桌面）
- [ ] 1440px（桌面）
- [ ] 1024px（小桌面/平板横屏）
- [ ] 768px（平板竖屏）
- [ ] 480px（手机横屏）
- [ ] 375px（手机竖屏）
- [ ] 320px（小屏手机）

## 功能测试清单

- [ ] 导航栏滚动效果
- [ ] 平滑滚动锚点
- [ ] 滚动触发动画
- [ ] 卡片悬停效果
- [ ] 移动端菜单
- [ ] 所有链接可点击
- [ ] 图片正常加载
- [ ] 响应式布局正常

## SEO 优化

### 已实现
- ✅ 语义化 HTML
- ✅ Meta 标签
- ✅ Open Graph
- ✅ Alt 文本
- ✅ 结构化标题

### 可选增强
- [ ] 添加 robots.txt
- [ ] 添加 sitemap.xml
- [ ] 添加 Schema.org 结构化数据
- [ ] 添加 Twitter Card

## 无障碍检查

- [ ] 键盘导航
- [ ] 屏幕阅读器兼容
- [ ] 颜色对比度
- [ ] 焦点指示器
- [ ] ARIA 标签

## 故障排除

### 图片不显示
检查图片路径是否正确（相对路径 `../`）

### 动画不流畅
检查浏览器是否支持 `IntersectionObserver`

### 移动端菜单不工作
检查 JavaScript 是否正常加载

### 样式错乱
清除浏览器缓存，强制刷新（Ctrl+F5）

## 更新日志

### v1.0.0 (2026-02-08)
- ✅ 初始版本发布
- ✅ Apple 风格设计
- ✅ 完整响应式支持
- ✅ 滚动动画效果
- ✅ 移动端优化

## 下一步计划

- [ ] 添加更多实际截图
- [ ] 集成视频演示
- [ ] 多语言支持
- [ ] 暗色模式切换
- [ ] 性能指标展示
- [ ] 用户评价区块

---

**需要帮助？** 查看 [README.md](README.md) 或提交 [Issue](https://github.com/StarsailsClover/LightSearch/issues)
