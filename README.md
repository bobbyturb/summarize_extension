# AI翻译与总结助手 - 浏览器插件

> 🇨🇳 **中国大陆用户？** 遇到连接问题？查看 → [**5分钟快速入门指南**](QUICK_START_CN.md) ⚡

一个强大的浏览器插件，使用AI技术自动翻译和总结网页内容。

## 功能特性

- 🌐 **智能翻译**
  - 整页翻译
  - 选中文本翻译
  - 支持多种目标语言

- 📝 **内容总结**
  - 自动提取页面主要内容
  - 生成简短/中等/详细的总结
  - 智能识别文章结构
  - **Markdown 格式化展示**（支持标题、列表、代码等）

- 🤖 **多AI服务支持**
  - OpenAI (GPT-3.5/GPT-4)
  - Anthropic (Claude)
  - Google Gemini
  - Ollama (本地AI)
  - 自定义API

- 📋 **侧边栏界面**
  - 翻译和总结结果展示在侧边栏
  - 不干扰页面浏览体验
  - 支持多标签切换

## 安装方法

### 重要提示 ⚠️

**中国大陆用户：** 由于网络限制，推荐使用以下方案之一：
1. **Ollama 本地AI**（推荐，免费，无需网络）
2. 国内 AI 服务（智谱AI、DeepSeek、通义千问等）
3. 使用代理访问 OpenAI/Claude

详细配置请查看：[API 配置指南](API_CONFIG_GUIDE.md)

### 1. 准备图标文件

在 `icons` 目录下放置以下尺寸的图标：
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

你可以使用在线工具生成图标，或使用任何PNG图片。

### 2. 加载插件到Chrome

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `browser-extension` 目录
5. 插件安装完成！

## 使用指南

### 首次配置

1. 点击插件图标，选择"设置"
2. 选择你想使用的AI服务商
3. 配置相应的API Key或服务地址
4. 点击"测试连接"确保配置正确
5. 保存设置

### AI服务商配置说明

#### OpenAI
- 获取API Key: https://platform.openai.com/api-keys
- 可选择 GPT-3.5 或 GPT-4 模型
- 支持自定义 Base URL（用于代理）

#### Anthropic Claude
- 获取API Key: https://console.anthropic.com
- 支持 Claude 3 系列模型

#### Google Gemini
- 获取API Key: https://makersuite.google.com/app/apikey
- 支持 Gemini Pro 和 Gemini 1.5 Pro

#### Ollama (本地AI)
- 需要先安装 Ollama: https://ollama.ai
- 启动 Ollama 服务
- 拉取模型：`ollama pull llama2`（或其他模型）
- 配置服务地址（默认 http://localhost:11434）

#### 自定义API
- 支持任何兼容 OpenAI 格式的API
- 配置 Base URL、API Key（可选）和模型名称

### 使用翻译功能

**方式1: 通过侧边栏**
1. 点击插件图标，选择"打开侧边栏"
2. 在侧边栏中选择目标语言
3. 点击"翻译整页"或"翻译选中"

**方式2: 通过右键菜单**
1. 选中要翻译的文本
2. 右键选择"翻译选中文本"
3. 在侧边栏中查看翻译结果

### 使用总结功能

1. 打开任意网页
2. 点击插件图标，选择"打开侧边栏"
3. 切换到"总结"标签
4. 选择总结长度（简短/中等/详细）
5. 点击"总结页面"
6. 在侧边栏中查看总结结果

**Markdown 格式化：** 总结结果支持 Markdown 格式，会自动渲染：
- 标题（# ## ###）
- 列表（- 或 1.）
- 粗体（**文本**）
- 代码（`code` 或 ```代码块```）
- 链接等

详细信息请查看 [Markdown 渲染文档](MARKDOWN_RENDERING.md)


## 项目结构

```
browser-extension/
├── manifest.json           # 插件配置文件
├── popup/                  # 弹出窗口（快速操作入口）
│   ├── popup.html
│   └── popup.js
├── sidebar/                # 侧边栏（主要功能界面）
│   ├── sidebar.html
│   ├── sidebar.css
│   └── sidebar.js
├── content/                # 内容脚本（页面内容提取）
│   ├── content.js
│   └── content.css
├── background/             # 后台服务（API调用）
│   └── background.js
├── options/                # 设置页面
│   ├── options.html
│   └── options.js
├── utils/                  # 工具函数
│   └── ai-service.js      # AI服务封装
└── icons/                  # 图标资源
```

## 技术栈

- **Manifest V3**: 最新的Chrome扩展标准
- **原生JavaScript**: 无框架依赖，性能优秀
- **Chrome Extension APIs**:
  - chrome.storage - 配置存储
  - chrome.sidePanel - 侧边栏
  - chrome.tabs - 标签页管理
  - chrome.contextMenus - 右键菜单

## 开发说明

### 本地调试

1. 修改代码后，在 `chrome://extensions/` 页面点击刷新按钮
2. 查看控制台输出：
   - Popup: 右键点击插件图标 → 检查
   - Sidebar: 打开侧边栏 → 右键 → 检查
   - Background: 在扩展管理页面点击"service worker"
   - Content Script: 在页面上 F12 → Console

### 常见问题

**Q: 提示"请先配置AI服务"**
A: 点击设置，选择AI服务商并配置API Key

**Q: 测试连接失败**
A:
1. 点击设置页面的"诊断工具"按钮，查看详细配置状态
2. 访问 `chrome://extensions/`，找到插件，点击 "service worker" 查看详细日志
3. 查看 `DEBUG_GUIDE.md` 文档了解如何调试
4. 确认 API Key 正确且有余额（OpenAI/Claude/Gemini）
5. 确认 Ollama 服务已启动（本地 AI）

**Q: Ollama连接失败**
A: 确保Ollama服务已启动，运行 `ollama serve`

**Q: API调用失败**
A: 检查API Key是否正确，网络是否畅通，余额是否充足

**Q: 无法提取页面内容**
A: 某些网站可能有特殊保护，插件会尽量提取可见文本

## 调试工具

### 诊断工具
在设置页面点击"诊断工具"按钮，可以：
- 查看当前配置状态
- 测试 AI 连接
- 检查存储内容
- 查看详细日志

### 查看日志
详细的日志查看指南请参考 `DEBUG_GUIDE.md` 文档。

快速查看 Background Service 日志：
1. 访问 `chrome://extensions/`
2. 找到 "AI翻译与总结助手"
3. 点击 "service worker" 链接
4. 查看控制台输出

## 隐私说明

- 所有配置（包括API Key）存储在本地浏览器中
- 不会收集或上传任何用户数据
- 页面内容仅发送到你配置的AI服务商
- 如使用Ollama，所有数据处理都在本地进行

## License

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2024-12-24)
- 初始版本发布
- 支持翻译和总结功能
- 支持多种AI服务商
- 侧边栏界面
