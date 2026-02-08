# 🚀 部署指南

## 快速部署到 GitHub Pages

### 方法 1：作为子目录（推荐）

当前项目结构已经支持直接部署：

```
LightSearch/
├── index.html          # 主应用
├── Introducing/        # 介绍站
│   └── index.html
└── ...
```

**访问路径**：
- 主应用：`https://yourusername.github.io/LightSearch/`
- 介绍站：`https://yourusername.github.io/LightSearch/Introducing/`

**步骤**：
1. 确保代码已推送到 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 `main` 分支
4. 保存，等待部署完成

### 方法 2：独立仓库

如果想让介绍站有独立域名：

```bash
# 1. 创建新仓库
gh repo create LightSearch-Intro --public

# 2. 复制文件
cd Introducing
git init
git add .
git commit -m "Initial commit"

# 3. 推送到 GitHub
git remote add origin https://github.com/yourusername/LightSearch-Intro.git
git push -u origin main

# 4. 启用 GitHub Pages
# 访问仓库 Settings → Pages → 选择 main 分支
```

**访问路径**：
- `https://yourusername.github.io/LightSearch-Intro/`

## 本地测试

### 使用 Python
```bash
cd Introducing
python -m http.server 8000
# 访问 http://localhost:8000
```

### 使用 Node.js
```bash
npm install -g http-server
cd Introducing
http-server -p 8000
# 访问 http://localhost:8000
```

### 使用 VS Code
1. 安装 Live Server 扩展
2. 右键 `index.html`
3. 选择 "Open with Live Server"

## 自定义域名

### GitHub Pages 自定义域名

1. **添加 CNAME 文件**
```bash
echo "intro.lightsearch.com" > CNAME
```

2. **配置 DNS**
在域名提供商处添加记录：
```
类型: CNAME
名称: intro
值: yourusername.github.io
```

3. **启用 HTTPS**
在 GitHub Pages 设置中勾选 "Enforce HTTPS"

## 优化部署

### 1. 压缩图片
```bash
# 使用 ImageOptim、TinyPNG 或命令行工具
# 推荐格式：WebP（带 PNG/JPG 回退）
```

### 2. 启用 CDN
考虑使用 Cloudflare 等 CDN：
- 加速全球访问
- 自动压缩
- 免费 SSL

### 3. 添加 robots.txt
```txt
User-agent: *
Allow: /

Sitemap: https://yourusername.github.io/LightSearch/Introducing/sitemap.xml
```

### 4. 添加 sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourusername.github.io/LightSearch/Introducing/</loc>
    <lastmod>2026-02-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 部署到其他平台

### Vercel
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
cd Introducing
vercel

# 3. 跟随提示完成配置
```

### Netlify
```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 部署
cd Introducing
netlify deploy

# 3. 生产部署
netlify deploy --prod
```

### Cloudflare Pages
1. 登录 Cloudflare Pages
2. 连接 GitHub 仓库
3. 配置构建设置：
   - Build command: (留空)
   - Build output directory: `Introducing`
4. 部署

## 性能监控

### Google Analytics
在 `index.html` 的 `</head>` 前添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Cloudflare Web Analytics
```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

## SEO 优化

### 1. 提交到搜索引擎
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 2. 生成 sitemap
使用在线工具或手动创建

### 3. 优化 Meta 标签
已在 `index.html` 中实现

### 4. 添加 Schema.org 标记
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LightSearch",
  "description": "简洁优雅的聚合搜索引擎",
  "url": "https://yourusername.github.io/LightSearch/",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Any"
}
</script>
```

## 故障排除

### 图片不显示
- 检查路径是否正确（相对路径 `../`）
- 确保图片文件存在
- 检查文件名大小写

### 样式不生效
- 清除浏览器缓存（Ctrl+F5）
- 检查 CSS 文件路径
- 查看浏览器控制台错误

### GitHub Pages 404
- 确保文件名正确（index.html）
- 检查分支设置
- 等待几分钟让部署完成

### 移动端显示异常
- 检查 viewport meta 标签
- 测试不同设备
- 使用浏览器开发者工具

## 更新部署

### 更新内容
```bash
# 1. 修改文件
# 2. 提交更改
git add .
git commit -m "Update introducing page"
git push

# 3. GitHub Pages 会自动重新部署
```

### 版本管理
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 安全检查

### HTTPS
- ✅ GitHub Pages 自动提供
- ✅ 强制 HTTPS（在设置中启用）

### 内容安全策略
添加 CSP meta 标签（可选）：
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 监控和维护

### 定期检查
- [ ] 链接是否有效
- [ ] 图片是否加载
- [ ] 性能是否正常
- [ ] 安全更新

### 性能测试
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 备份

### 定期备份
```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/LightSearch.git backup

# 2. 或下载 ZIP
# GitHub 仓库页面 → Code → Download ZIP
```

---

## 快速命令参考

```bash
# 本地测试
python -m http.server 8000

# 推送到 GitHub
git add .
git commit -m "Update"
git push

# 查看部署状态
# 访问 GitHub 仓库 → Actions

# 清除缓存
# Ctrl+F5 (Windows/Linux)
# Cmd+Shift+R (Mac)
```

---

**需要帮助？**
- 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
- 提交 [Issue](https://github.com/StarsailsClover/LightSearch/issues)

**祝部署顺利！** 🚀
