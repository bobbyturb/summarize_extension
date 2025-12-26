# 中国大陆用户快速入门

如果你遇到"域名被解析到 198.18.1.150"或"连接失败"的问题，这是 DNS 污染导致的。

## 🎯 推荐方案：使用 Ollama（5分钟搞定）

Ollama 是一个本地 AI 运行工具，完全免费，无需网络，速度快。

### 第一步：安装 Ollama

**Linux / macOS:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
访问 https://ollama.com/download 下载安装包

**验证安装：**
```bash
ollama --version
```

### 第二步：启动 Ollama 服务

打开终端/命令行，运行：
```bash
ollama serve
```

保持这个终端窗口运行（不要关闭）。

**验证服务：**
在浏览器访问 http://localhost:11434
应该看到 "Ollama is running"

### 第三步：下载模型

打开**新的**终端窗口，运行：

```bash
# 推荐：通义千问 2 (7B) - 中文表现优秀
ollama pull qwen2:7b
```

等待下载完成（约 4.4GB，首次需要几分钟）。

**可选的其他模型：**
```bash
# 超小模型，快速测试用（352MB）
ollama pull qwen2:0.5b

# Llama 3.1 - 英文优秀（4.7GB）
ollama pull llama3.1:8b

# Gemma 2 - 平衡性好（5.5GB）
ollama pull gemma2:9b
```

**查看已下载的模型：**
```bash
ollama list
```

### 第四步：配置插件

1. 点击浏览器中的插件图标
2. 选择"设置"
3. 在 **AI服务商** 下拉菜单中选择 **`Ollama (本地)`**
4. 配置如下：
   - **Ollama服务地址**: `http://localhost:11434`（默认值）
   - **模型名称**: `qwen2:7b`（你下载的模型名）
5. 点击 **"保存设置"**
6. 点击 **"测试连接"**

看到 "✓ 连接成功" 就可以开始使用了！

### 第五步：开始使用

1. 访问任意网页
2. 点击插件图标 → "打开侧边栏"
3. 点击 "翻译整页" 或 "总结页面"

## 💡 使用技巧

### 切换模型
如果下载了多个模型，在设置中修改"模型名称"即可切换。

### 性能优化
- **qwen2:0.5b**: 最快，适合简单任务
- **qwen2:7b**: 平衡，推荐日常使用
- **llama3.1:8b**: 英文场景
- **gemma2:9b**: 复杂任务

### 同时使用多个模型
Ollama 支持同时加载多个模型，不同场景可以切换使用。

## 🔧 常见问题

### Q: 提示"无法连接到 Ollama 服务"

**检查服务是否运行：**
```bash
# 在浏览器访问
http://localhost:11434

# 或使用 curl
curl http://localhost:11434
```

如果没有响应，重新运行：
```bash
ollama serve
```

### Q: 提示"模型不存在"

检查模型名称是否正确：
```bash
ollama list
```

确保设置中的"模型名称"与列表中的名称一致（区分大小写）。

### Q: 下载模型很慢

Ollama 会从官方源下载，如果速度慢可以：
1. 使用更小的模型（如 qwen2:0.5b）
2. 使用代理
3. 耐心等待（只需下载一次）

### Q: 内存不足

不同模型对内存要求不同：
- **qwen2:0.5b**: ~1GB RAM
- **qwen2:7b**: ~8GB RAM
- **llama3.1:8b**: ~8GB RAM
- **gemma2:9b**: ~10GB RAM

如果内存不足，使用更小的模型。

### Q: 想要更好的效果

如果对结果不满意，可以：
1. 尝试更大的模型（如 qwen2:14b）
2. 或使用在线服务（需要处理网络问题）

## 🎓 进阶使用

### 使用多个 AI 服务

你可以配置多个 AI 服务，根据需要切换：
- **Ollama**: 日常快速翻译/总结
- **DeepSeek**: 复杂的专业内容（国内可访问）
- **OpenAI**: 最高质量（需要代理）

### 自定义提示词

如果想要调整翻译或总结的风格，可以修改源代码中的 prompt。

### 性能监控

在 Ollama 运行的终端窗口可以看到实时日志：
- 加载时间
- 推理时间
- 内存使用

## 🆚 方案对比

| 方案 | 优点 | 缺点 | 适合人群 |
|------|------|------|---------|
| **Ollama** | 免费、快速、隐私 | 需要下载模型 | 所有用户（推荐） |
| 国内 AI | 直接访问、无需安装 | 付费、有限额 | 不想安装软件的用户 |
| OpenAI/Claude | 效果最好 | 需要代理、付费 | 追求质量的用户 |

## 📚 更多资源

- Ollama 官网: https://ollama.com/
- Ollama 模型库: https://ollama.com/library
- 完整配置指南: [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md)
- 故障排查: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 💬 需要帮助？

如果遇到问题：
1. 查看插件的"诊断工具"
2. 阅读 [DEBUG_GUIDE.md](DEBUG_GUIDE.md)
3. 在 GitHub 提交 Issue

---

**总结：** 使用 Ollama 是中国大陆用户最简单、最经济的方案。5分钟安装，永久免费使用！
