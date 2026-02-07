# 🚀 LightSearch 快速开始指南

5分钟上手 LightSearch 重构版！

## 📥 安装

### 方式一：直接使用（最简单）

1. 下载项目
2. 双击打开 `index-new.html`
3. 开始使用！

### 方式二：本地服务器（推荐）

```bash
# 使用 Python
cd LightSearch
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

然后访问：`http://localhost:8000/index-new.html`

## 🎯 核心功能

### 1. 基础搜索

```
1. 在搜索框输入关键词
2. 按 Enter 或点击"搜索"
3. 所有启用的引擎在新标签页打开
```

**快捷键：**
- `Ctrl + /` - 聚焦搜索框
- `Enter` - 执行搜索

### 2. 学术搜索

```
1. 点击右上角"学术搜索"
2. 输入学术关键词
3. 可选择发表时间过滤
4. 执行搜索
```

**支持的学术引擎：**
- Google Scholar
- PubMed
- arXiv
- IEEE Xplore
- JSTOR

### 3. Command Palette（命令面板）

**最强大的功能！**

```
按 Ctrl+K (Windows/Linux) 或 Cmd+K (Mac)
```

可以做什么？
- 快速搜索
- 切换主题
- 打开设置
- 执行任何操作

**示例：**
```
Ctrl+K → 输入 "dark" → Enter
（立即切换到深色主题）
```

### 4. 主题切换

**4种精美主题：**

1. **LightSearch Classic** - 经典白色
2. **Classic Dark** - 深色护眼
3. **Liquid Glass** - 玻璃态（超酷！）
4. **Eye Comfort** - 护眼绿

**切换方式：**
- 设置 → 个性化 → 主题
- 或 Command Palette → 输入主题名

### 5. 多语言

**支持5种语言：**
- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇷🇺 Русский

**自动检测：**
- 首次访问自动检测浏览器语言
- 可在设置中手动切换

### 6. 搜索对比模式

**同时查看多个搜索引擎结果！**

```
1. 设置 → 高级 → 启用对比模式
2. 执行搜索
3. 结果在同一窗口的标签页中打开
```

## ⚙️ 自定义设置

### 添加搜索引擎

```
1. 打开设置
2. 搜索引擎 → 输入框
3. 输入引擎URL（必须包含 {query}）
   例如：https://www.google.com/search?q={query}
4. 点击"添加"
```

### 自定义背景

```
1. 设置 → 个性化 → 背景
2. 点击"上传背景"
3. 选择图片
4. 完成！
```

### 管理搜索引擎

```
✅ 勾选 = 启用引擎
❌ 取消勾选 = 禁用引擎
🗑️ 点击"删除" = 移除引擎
```

## 🎨 主题预览

### Liquid Glass 主题

**最炫酷的主题！**

特点：
- 渐变背景（紫色 → 粉色）
- 玻璃态模糊效果
- 半透明卡片
- 发光边框

**如何启用：**
```
设置 → 个性化 → 主题 → Liquid Glass
```

## 🔥 高级技巧

### 1. 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+K` / `Cmd+K` | 打开命令面板 |
| `Ctrl+/` | 聚焦搜索框 |
| `Enter` | 执行搜索 |
| `Esc` | 关闭弹窗 |
| `↑` / `↓` | 命令面板导航 |

### 2. 搜索历史

- 自动保存最近50次搜索
- 点击历史项快速填充搜索框
- 支持搜索建议

### 3. 引擎管理技巧

**推荐配置：**
```
常用引擎：
✅ Google
✅ Bing
✅ Baidu

备用引擎：
❌ DuckDuckGo（需要时启用）
❌ Yandex（需要时启用）
```

### 4. 学术搜索过滤

**时间过滤：**
- 不限 - 所有时间
- 近1年 - 最新研究
- 近5年 - 近期研究
- 近10年 - 较新研究

**示例：**
```
搜索："machine learning"
时间：近1年
→ 只显示2024-2025年的论文
```

## 🐛 常见问题

### Q: 为什么搜索没反应？

**A:** 检查：
1. 是否至少启用了一个搜索引擎
2. 浏览器是否拦截了弹窗
3. 网络连接是否正常

### Q: Command Palette 快捷键不工作？

**A:** 可能被其他软件占用，尝试：
1. 关闭其他可能占用快捷键的软件
2. 使用鼠标点击打开

### Q: 主题切换后样式错乱？

**A:** 刷新页面（`Ctrl+F5` 强制刷新）

### Q: 语言切换不生效？

**A:** 确保：
1. 网络正常（需要加载语言包）
2. 刷新页面

### Q: 如何恢复默认设置？

**A:** 
```javascript
// 在浏览器控制台运行
localStorage.clear();
location.reload();
```

## 💡 最佳实践

### 1. 搜索效率

```
✅ 启用3-5个常用引擎
❌ 不要启用太多引擎（会很慢）
```

### 2. 主题选择

```
白天：LightSearch Classic
晚上：Classic Dark
炫酷：Liquid Glass
护眼：Eye Comfort
```

### 3. 学术搜索

```
综合搜索：Google Scholar
医学：PubMed
计算机：arXiv + IEEE Xplore
```

## 🎓 进阶使用

### 自定义搜索引擎

**示例：添加 Wikipedia**
```
URL: https://en.wikipedia.org/wiki/Special:Search?search={query}
```

**示例：添加 GitHub**
```
URL: https://github.com/search?q={query}
```

**示例：添加 YouTube**
```
URL: https://www.youtube.com/results?search_query={query}
```

### 组合使用

**场景1：学术研究**
```
1. 启用 Google Scholar + PubMed + arXiv
2. 设置时间过滤：近5年
3. 启用对比模式
4. 搜索关键词
→ 在同一窗口对比三个数据库的结果
```

**场景2：日常搜索**
```
1. 启用 Google + Bing
2. 使用 Command Palette 快速搜索
3. 查看搜索历史
```

## 📊 性能优化

### 减少搜索引擎数量
```
推荐：3-5个
最多：不超过8个
```

### 使用本地服务器
```
更快的加载速度
更好的模块支持
```

### 清理搜索历史
```
设置 → 高级 → 清除历史
（定期清理可提升性能）
```

## 🔗 相关链接

- [完整文档](./README-REFACTOR.md)
- [开发者文档](./DEVELOPER.md)
- [迁移指南](./MIGRATION.md)
- [GitHub仓库](https://github.com/StarsailsClover/LightSearch)
- [提交问题](https://github.com/StarsailsClover/LightSearch/issues)

## 🎉 开始使用

现在你已经掌握了所有基础知识，开始使用 LightSearch 吧！

**推荐第一步：**
1. ✅ 尝试 Command Palette（`Ctrl+K`）
2. ✅ 切换到 Liquid Glass 主题
3. ✅ 添加你喜欢的搜索引擎
4. ✅ 执行第一次搜索

**享受搜索的乐趣！** 🚀

---

**需要帮助？** [提交 Issue](https://github.com/StarsailsClover/LightSearch/issues)
