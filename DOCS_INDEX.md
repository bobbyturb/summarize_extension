# 文档索引

快速找到你需要的文档。

## 📖 核心文档

### [README.md](README.md)
项目主文档，包含：
- 功能介绍
- 安装方法
- 基本使用指南
- 项目结构

**适合**：首次了解项目的用户

---

## 🇨🇳 中国大陆用户专区

### [QUICK_START_CN.md](QUICK_START_CN.md) ⭐ 重点推荐
**5分钟快速入门指南**

如果你遇到以下问题：
- 测试连接失败
- 域名被解析到 198.18.x.x
- DNS 污染
- 网络错误

本文档提供**最快**的解决方案：使用 Ollama 本地 AI。

**内容包括**：
- Ollama 安装步骤（复制粘贴命令即可）
- 推荐模型下载
- 插件配置
- 常见问题解答

---

## 🔧 配置与调试

### [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md)
**完整的 API 配置指南**

**适合**：
- 想要了解所有 AI 服务配置方法
- 需要使用 OpenAI/Claude/Gemini
- 想要使用国内 AI 服务
- 需要配置代理

**内容包括**：
- 各种 AI 服务的详细配置方法
- 国内可用 AI 服务清单（智谱AI、DeepSeek等）
- 代理配置说明
- 性能对比
- Ollama 详细使用指南

### [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**快速故障排查清单**

**适合**：遇到问题需要快速解决

**内容包括**：
- 分步骤排查流程
- DNS 污染专项解决方案
- 针对各个 AI 服务的具体问题排查
- 配置检查清单
- 常用调试命令

### [DEBUG_GUIDE.md](DEBUG_GUIDE.md)
**详细的调试指南**

**适合**：
- 开发者
- 需要深入排查问题
- 想要了解插件内部工作原理

**内容包括**：
- 如何查看各个组件的日志
- Background Service Worker 调试
- 日志解读
- 性能监控
- 手动测试方法

---

## 🎨 开发文档

### icons/README.md 和 ICON_NEEDED.md
图标生成和配置说明

**适合**：
- 首次安装插件
- 需要生成图标文件
- 自定义插件图标

---

## 🚀 快速导航

### 我是新用户
1. 阅读 [README.md](README.md) 了解项目
2. 如果在中国大陆，直接看 [QUICK_START_CN.md](QUICK_START_CN.md)
3. 否则，看 [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md) 选择合适的 AI 服务

### 我遇到了问题
1. 先查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) 快速排查
2. 如果是 DNS/网络问题，看 [QUICK_START_CN.md](QUICK_START_CN.md)
3. 如果需要详细日志，看 [DEBUG_GUIDE.md](DEBUG_GUIDE.md)

### 我想配置特定的 AI 服务
1. 查看 [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md)
2. 找到对应服务商的配置说明
3. 按步骤配置

### 我想深入了解或开发
1. 阅读 [README.md](README.md) 的项目结构部分
2. 阅读 [DEBUG_GUIDE.md](DEBUG_GUIDE.md) 了解调试方法
3. 查看源代码注释

---

## 📊 文档对比

| 文档 | 长度 | 难度 | 适合场景 |
|------|------|------|---------|
| [QUICK_START_CN.md](QUICK_START_CN.md) | 短 | ⭐ 简单 | 中国大陆用户快速入门 |
| [README.md](README.md) | 中 | ⭐ 简单 | 了解项目和基本使用 |
| [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md) | 长 | ⭐⭐ 中等 | 详细配置各种 AI 服务 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 中 | ⭐⭐ 中等 | 问题排查 |
| [DEBUG_GUIDE.md](DEBUG_GUIDE.md) | 长 | ⭐⭐⭐ 高级 | 深入调试和开发 |

---

## 🔍 按问题类型查找

### DNS 污染 / 网络问题
→ [QUICK_START_CN.md](QUICK_START_CN.md) 或 [TROUBLESHOOTING.md](TROUBLESHOOTING.md#dns-pollution)

### API Key 错误
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md#api-key-error)

### Ollama 相关
→ [QUICK_START_CN.md](QUICK_START_CN.md) 或 [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md#ollama)

### 国内 AI 服务配置
→ [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md#domestic-services)

### 代理配置
→ [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md#proxy-setup)

### 查看日志
→ [DEBUG_GUIDE.md](DEBUG_GUIDE.md#viewing-logs)

### 性能问题
→ [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md#performance) 或 [DEBUG_GUIDE.md](DEBUG_GUIDE.md#performance)

---

## 💡 提示

- 所有文档都可以在插件目录中直接查看
- 文档中的链接可以快速跳转
- 遇到问题时，先看 TROUBLESHOOTING.md 的快速检查清单
- 大部分用户只需要看 QUICK_START_CN.md 或 API_CONFIG_GUIDE.md

## 📞 还需要帮助？

如果文档没有解决你的问题：
1. 使用插件的"诊断工具"（设置页面）
2. 查看 Background Service Worker 日志
3. 在 GitHub 提交 Issue 并附上日志

---

**快速开始**: [中国大陆用户](QUICK_START_CN.md) | [其他地区用户](API_CONFIG_GUIDE.md)
