# Markdown 渲染功能

## 功能说明

插件支持 Markdown 格式的内容渲染，特别是在**总结功能**中。当 AI 返回包含 Markdown 格式的内容时，会自动进行格式化展示。

## ⚠️ 技术说明

由于 Chrome Manifest V3 的安全限制，不允许从外部 CDN 加载脚本。插件使用**内置的 Markdown 渲染器**，零依赖，安全可靠。

## 支持的 Markdown 语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 文本样式
```markdown
**粗体文本**
*斜体文本*
`行内代码`
```

### 列表
```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

### 代码块
````markdown
```javascript
function hello() {
  console.log('Hello World');
}
```
````

### 链接
```markdown
[链接文本](https://example.com)
```

### 分隔线
```markdown
---
```

## 渲染效果示例

### 输入（AI 返回的 Markdown）

```markdown
## 文章总结

本文主要讨论了以下要点：

1. **第一个要点**
   - 详细说明 A
   - 包含代码示例：`console.log('hello')`

2. **第二个要点**
   - 相关链接：[参考资料](https://example.com)

### 结论

这是一篇值得阅读的文章。
```

### 输出（渲染后的效果）

- ✅ 二级标题带下划线和颜色
- ✅ 有序列表正确编号
- ✅ 粗体文本加粗显示
- ✅ 行内代码带背景色
- ✅ 链接可点击（新窗口打开）
- ✅ 三级标题正确显示

## 技术实现

### 内置 Markdown 渲染器

**特点：**
- ✅ **零依赖**: 不需要外部库
- ✅ **安全**: 完整的 XSS 防护
- ✅ **快速**: 毫秒级渲染
- ✅ **可靠**: 正确处理边界情况

**实现亮点：**

1. **占位符保护**
   - 代码块和行内代码先提取保护
   - 避免被其他规则误处理
   - 处理完成后再恢复

2. **智能列表处理**
   - 正确区分有序和无序列表
   - 自动闭合列表标签
   - 支持连续的列表项
   - **保留原始编号**: 有序列表会保留 Markdown 中的原始数字（如 `2. 项目` 会显示为 "2."，而非重新从 1 开始编号）

3. **XSS 防护**
   - 所有代码内容都经过 HTML 转义
   - 链接使用 `rel="noopener"` 属性
   - 防止恶意脚本执行

### 代码位置

- **渲染器**: `utils/markdown.js`
- **样式**: `sidebar/sidebar.css`（Markdown 渲染样式部分）
- **调用**: `sidebar/sidebar.js`（displayResult 函数）

## 样式定制

### 标题样式
- **H1**: 20px，蓝色，底部蓝色边框，紧凑间距
- **H2**: 18px，黑色，底部灰色边框，紧凑间距
- **H3**: 16px，灰色，紧凑间距

### 代码样式
- **行内代码**: 浅灰背景，粉红色文字
- **代码块**: 深色背景（#2d2d2d），浅色文字

### 列表样式
- **有序列表**: 保留原始编号（使用 `value` 属性）
- **紧凑间距**: 列表项之间 2px 间距，列表上下 6px 间距

### 段落样式
- **紧凑布局**: 段落间距 6px
- **首尾优化**: 首个元素无上边距，末个元素无下边距

### 自定义修改

编辑 `sidebar/sidebar.css`:

```css
/* 修改标题颜色 */
.result h1 {
  color: #your-color;
}

/* 修改代码背景 */
.result pre {
  background: #your-background;
}

/* 修改链接颜色 */
.result a {
  color: #your-link-color;
}
```

## 使用方法

### 自动渲染

总结功能会**自动使用** Markdown 渲染：

```javascript
// 在 sidebar.js 中
displayResult(resultEl, summaryResponse.result, true);  // true 表示使用 Markdown
```

### 禁用 Markdown

如果需要显示纯文本：

```javascript
displayResult(resultEl, summaryResponse.result, false);  // false 表示纯文本
```

## 故障排查

### 问题：Markdown 没有被渲染

**检查：**

1. 打开侧边栏，按 F12
2. 在 Console 中运行：
   ```javascript
   console.log(typeof renderMarkdownContent);  // 应该是 'function'
   ```

**可能原因：**
- markdown.js 未加载
- JavaScript 错误

**解决：**
- 访问 `chrome://extensions/` 刷新插件
- 检查控制台错误信息

### 问题：样式不正确

**解决：**
- 确保 sidebar.css 已加载
- 刷新插件后重试
- 清除浏览器缓存

### 问题：某些语法不生效

**当前支持：**
- ✅ 标题（# ## ###）
- ✅ 粗体、斜体
- ✅ 代码和代码块
- ✅ 列表（有序、无序）
- ✅ 链接
- ✅ 分隔线

**暂不支持：**
- ❌ 表格
- ❌ 任务列表
- ❌ 脚注
- ❌ LaTeX 公式

如需这些功能，欢迎提交 Issue 或 PR。

## 性能

- **渲染器大小**: ~5KB（未压缩）
- **渲染速度**: <5ms（典型内容）
- **内存占用**: 可忽略不计

## 安全性

### XSS 防护

所有用户内容都经过转义：

```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 安全链接

所有链接添加安全属性：

```html
<a href="..." target="_blank" rel="noopener">...</a>
```

## 调试

### 手动测试

在侧边栏控制台中：

```javascript
// 测试渲染
const result = renderMarkdownContent(`
## 测试标题

这是**粗体**和*斜体*文本。

- 列表项 1
- 列表项 2

\`\`\`javascript
console.log('代码块');
\`\`\`
`);

console.log(result);
```

### 查看渲染步骤

```javascript
// 添加调试日志到 markdown.js
function renderMarkdown(markdown) {
  console.log('输入:', markdown);
  // ... 渲染逻辑 ...
  console.log('输出:', html);
  return html;
}
```

## 文件清单

Markdown 功能相关文件：

```
browser-extension/
├── utils/
│   └── markdown.js          # 渲染器核心代码
├── sidebar/
│   ├── sidebar.html         # 引入 markdown.js
│   ├── sidebar.js           # 调用渲染函数
│   └── sidebar.css          # Markdown 样式
└── MARKDOWN_RENDERING.md    # 本文档
```

## 未来改进

可能的改进方向：

1. **表格支持** - 解析 Markdown 表格语法
2. **语法高亮** - 为代码块添加语法高亮
3. **主题切换** - 支持亮色/暗色主题
4. **更多语法** - 任务列表、脚注等
5. **性能优化** - 大文档的增量渲染

## 贡献

欢迎提交改进建议：
- 提交 Issue 报告问题
- 提交 PR 添加新功能
- 优化现有实现

---

**总结**: 插件使用自研的轻量级 Markdown 渲染器，零依赖，安全可靠，支持所有常用 Markdown 语法。
