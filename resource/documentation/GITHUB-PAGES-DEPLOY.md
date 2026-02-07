# 🚀 LightSearch - GitHub Pages 部署指南

## 📋 部署前准备

### 方案选择

**推荐：使用 standalone.html 作为主页** ⭐⭐⭐

**原因：**
- ✅ 无需修改任何代码
- ✅ 完美支持 GitHub Pages
- ✅ 所有功能正常工作
- ✅ 无 CORS 问题

---

## 🔧 部署步骤

### 步骤 1：备份当前 index.html

```bash
# 重命名当前 index.html 为 index-modular.html（保留模块化版本）
Rename-Item "index.html" "index-modular.html"
```

### 步骤 2：复制 standalone.html 为 index.html

```bash
# 复制 standalone.html 为 index.html
Copy-Item "standalone.html" "index.html"
```

### 步骤 3：创建 GitHub Pages 配置

需要创建以下文件：
- `.nojekyll` - 禁用 Jekyll 处理
- `README.md` - 项目说明
- `CNAME` - 自定义域名（可选）

### 步骤 4：推送到 GitHub

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 步骤 5：启用 GitHub Pages

1. 进入仓库 Settings
2. 找到 Pages 选项
3. Source 选择 `main` 分支
4. 点击 Save

---

## 📁 部署文件结构

```
LightSearch/
├── index.html              ✅ 主页（从 standalone.html 复制）
├── standalone.html         ✅ 保留原文件
├── index-modular.html      ✅ 模块化版本（备份）
├── .nojekyll              ✅ GitHub Pages 配置
├── README.md              ✅ 项目说明
├── icon.png               ✅ 图标
├── LICENSE                ✅ 许可证
│
├── src/                   ⚠️ 保留但不使用
├── locales/               ⚠️ 保留但不使用
└── 文档/                  ✅ 保留
```

---

## ⚠️ 重要说明

### GitHub Pages 限制

1. **不支持服务器端代码**
   - ❌ 无法运行 Python/Node.js
   - ❌ 无法使用后端 API
   - ✅ 只能使用静态 HTML/CSS/JS

2. **ES6 模块限制**
   - ⚠️ 需要正确的 MIME 类型
   - ⚠️ 可能有跨域问题
   - ✅ 使用单文件版本避免问题

3. **文件路径**
   - ✅ 使用相对路径
   - ✅ 文件名区分大小写

---

## 🎯 推荐配置

### 使用 standalone.html 版本

**优点：**
- ✅ 零配置
- ✅ 完美兼容
- ✅ 功能完整

**缺点：**
- ❌ 无多语言支持
- ❌ 无 Command Palette

### 功能对比

| 功能 | standalone.html | 模块化版本 |
|------|----------------|-----------|
| GitHub Pages 支持 | ✅ 完美 | ⚠️ 可能有问题 |
| 基础搜索 | ✅ | ✅ |
| 学术搜索 | ✅ | ✅ |
| 引擎管理 | ✅ | ✅ |
| 主题切换 | ✅ | ✅ |
| 多语言 | ❌ | ✅ |
| Command Palette | ❌ | ✅ |

---

## 🔄 自动部署脚本

我会为你创建自动部署脚本。

---

## 📝 部署后验证

### 检查清单

- [ ] 访问 `https://yourusername.github.io/LightSearch`
- [ ] 页面正常显示
- [ ] 搜索功能正常
- [ ] 设置按钮可以打开
- [ ] 学术搜索按钮可以打开
- [ ] 主题切换正常
- [ ] 无控制台错误

---

## 🐛 常见问题

### Q: 页面显示 404？
**A:** 检查仓库设置中 GitHub Pages 是否已启用

### Q: 样式没有加载？
**A:** 检查文件路径是否正确，使用相对路径

### Q: 功能不工作？
**A:** 按 F12 查看控制台错误信息

---

## 🎉 部署完成后

访问地址：
```
https://StarsailsClover.github.io/LightSearch
```

---

**准备好了吗？让我为你执行部署准备！**
