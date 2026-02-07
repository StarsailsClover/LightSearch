# 🚨 CORS 问题解决方案

## ❌ 问题原因

你遇到的错误是 **CORS（跨域资源共享）问题**：

```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

**原因：** ES6 模块（`import/export`）必须通过 HTTP(S) 协议加载，不能直接从文件系统（`file://`）加载。

---

## ✅ 解决方案（3种方法）

### 方法1：使用启动脚本（最简单）⭐⭐⭐

```bash
# 双击运行这个文件
start-server.bat
```

**这个脚本会：**
1. 自动启动 Python HTTP 服务器
2. 自动打开浏览器
3. 自动访问正确的地址

**文件位置：**
```
C:\Users\Sails\Documents\Coding\LightSearch\start-server.bat
```

---

### 方法2：使用单文件版本（无需服务器）⭐⭐⭐

```bash
# 直接双击打开这个文件
standalone.html
```

**特点：**
- ✅ 无需 HTTP 服务器
- ✅ 双击即可使用
- ✅ 所有代码都在一个文件中
- ✅ 功能完整（搜索、设置、学术搜索、主题）

**文件位置：**
```
C:\Users\Sails\Documents\Coding\LightSearch\standalone.html
```

---

### 方法3：手动启动服务器

#### 步骤1：打开 PowerShell
```
Win + X → 选择 "Windows PowerShell"
```

#### 步骤2：进入项目目录
```powershell
cd C:\Users\Sails\Documents\Coding\LightSearch
```

#### 步骤3：启动服务器
```powershell
python -m http.server 8000
```

#### 步骤4：打开浏览器
```
访问: http://localhost:8000/index-new.html
```

---

## 🎯 推荐使用方式

### 日常使用 → standalone.html ⭐
- 双击即用
- 无需任何配置
- 功能完整

### 开发测试 → start-server.bat + index-new.html
- 模块化代码
- 易于维护
- 完整功能

---

## 📊 三种版本对比

| 特性 | standalone.html | index-new.html | 旧版 index.html |
|------|----------------|----------------|----------------|
| 无需服务器 | ✅ | ❌ | ✅ |
| 模块化代码 | ❌ | ✅ | ❌ |
| 多语言支持 | ❌ | ✅ | ❌ |
| Command Palette | ❌ | ✅ | ❌ |
| 基础搜索 | ✅ | ✅ | ✅ |
| 学术搜索 | ✅ | ✅ | ✅ |
| 主题切换 | ✅ | ✅ | ✅ |
| 引擎管理 | ✅ | ✅ | ✅ |
| 推荐度 | ⭐⭐⭐ | ⭐⭐ | ⭐ |

---

## 🚀 立即开始

### 最快方式（5秒）

```bash
1. 找到文件：standalone.html
2. 双击打开
3. 开始使用！
```

### 完整功能方式（30秒）

```bash
1. 找到文件：start-server.bat
2. 双击运行
3. 浏览器自动打开
4. 开始使用！
```

---

## 🔍 验证是否成功

### standalone.html 验证
- [ ] 双击打开后，页面正常显示
- [ ] 点击"搜索"按钮有反应
- [ ] 点击"设置"按钮打开弹窗
- [ ] 点击"学术搜索"按钮打开弹窗
- [ ] 点击"切换主题"按钮切换深色/浅色

### index-new.html 验证
- [ ] 浏览器地址栏显示 `http://localhost:8000/...`
- [ ] 按 F12 打开控制台
- [ ] 控制台显示 "✨ LightSearch initialized successfully!"
- [ ] 无红色错误信息
- [ ] 所有按钮正常工作

---

## 🐛 常见问题

### Q: start-server.bat 运行后立即关闭？
**A:** Python 未安装或未添加到 PATH
```bash
# 解决方案
1. 下载 Python: https://www.python.org/downloads/
2. 安装时勾选 "Add Python to PATH"
3. 重新运行 start-server.bat
```

### Q: standalone.html 打开后样式错乱？
**A:** 浏览器缓存问题
```bash
# 解决方案
按 Ctrl+F5 强制刷新
```

### Q: 服务器启动后浏览器没有自动打开？
**A:** 手动打开浏览器
```bash
# 访问地址
http://localhost:8000/index-new.html
```

### Q: 端口 8000 被占用？
**A:** 更改端口
```bash
# 编辑 start-server.bat，将 8000 改为其他端口
python -m http.server 8080
```

---

## 📁 文件说明

### 新增文件

```
✅ standalone.html           # 单文件版本（推荐日常使用）
✅ start-server.bat          # 启动脚本（推荐开发使用）
✅ CORS-FIX.md              # 本文档
```

### 使用建议

```
日常使用:
  → standalone.html

开发/测试:
  → start-server.bat
  → index-new.html

备份/参考:
  → index.html (旧版)
```

---

## 🎉 总结

**最简单的方法：**
```
双击 standalone.html → 立即使用
```

**完整功能方法：**
```
双击 start-server.bat → 自动启动 → 开始使用
```

**两种方法都能解决 CORS 问题！**

---

## 📞 需要帮助？

如果仍有问题：

1. 查看控制台错误信息（F12）
2. 检查文件是否存在
3. 尝试另一种方法
4. 提交 Issue

---

**文件位置：**
- `C:\Users\Sails\Documents\Coding\LightSearch\standalone.html`
- `C:\Users\Sails\Documents\Coding\LightSearch\start-server.bat`

**立即尝试！** 🚀
