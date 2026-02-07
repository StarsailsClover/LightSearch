# 🎯 LightSearch - 立即开始（CORS 问题已解决）

## ⚡ 5秒快速开始

### 方法1：单文件版本（推荐）

```
1. 找到文件：standalone.html
2. 双击打开
3. 完成！
```

**特点：**
- ✅ 无需任何配置
- ✅ 双击即用
- ✅ 功能完整

---

### 方法2：完整版本（需要HTTP服务器）

```
1. 找到文件：start-server.bat
2. 双击运行
3. 浏览器自动打开
4. 完成！
```

**特点：**
- ✅ 自动启动服务器
- ✅ 自动打开浏览器
- ✅ 模块化代码

---

## 📁 文件位置

所有文件都在：
```
C:\Users\Sails\Documents\Coding\LightSearch\
```

**重要文件：**
- `standalone.html` ← 双击这个（最简单）
- `start-server.bat` ← 或双击这个（完整功能）

---

## ✅ 功能验证

打开后测试以下功能：

- [ ] 输入关键词，点击"搜索"
- [ ] 点击"设置"按钮
- [ ] 点击"学术搜索"按钮
- [ ] 点击"切换主题"按钮（standalone.html）
- [ ] 搜索历史正常显示

---

## 🎨 两个版本对比

### standalone.html（推荐日常使用）
- ✅ 双击即用
- ✅ 无需服务器
- ✅ 基础功能完整
- ❌ 无多语言
- ❌ 无 Command Palette

### index.html（需要服务器）
- ✅ 完整功能
- ✅ 多语言支持
- ✅ Command Palette
- ✅ 模块化代码
- ❌ 需要 HTTP 服务器

---

## 🚨 CORS 问题说明

**问题：** 直接打开 `index-new.html` 会报错

**原因：** ES6 模块必须通过 HTTP 协议加载

**解决方案：**
1. 使用 `standalone.html`（无需服务器）
2. 使用 `start-server.bat`（自动启动服务器）

---

## 📖 详细文档

- **CORS-FIX.md** - CORS 问题详细说明
- **QUICKSTART.md** - 完整使用指南
- **TROUBLESHOOTING.md** - 故障排除

---

## 🎉 开始使用

**现在就双击 `standalone.html` 开始使用吧！**

简单、快速、无需配置！🚀
