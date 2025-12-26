# API 访问配置指南

## 中国大陆用户必读 ⚠️

由于网络限制，在中国大陆直接访问某些 AI 服务（如 OpenAI、Claude）会遇到 DNS 污染问题，表现为：
- 域名被解析到 198.18.x.x 等无效 IP
- 请求超时或连接失败
- 测试连接失败

## 推荐解决方案

### 🎯 方案1: 使用本地 Ollama（推荐）

**优点：**
- ✅ 完全免费
- ✅ 无需网络
- ✅ 数据隐私
- ✅ 无速率限制

**安装步骤：**

1. 安装 Ollama
   ```bash
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh

   # macOS
   brew install ollama

   # Windows
   访问 https://ollama.com/download 下载安装包
   ```

2. 启动服务
   ```bash
   ollama serve
   ```

3. 下载模型（推荐中文友好模型）
   ```bash
   # 阿里通义千问 2 (7B) - 强烈推荐
   ollama pull qwen2:7b

   # 或其他模型
   ollama pull llama3.1       # Meta Llama 3.1
   ollama pull gemma2:9b      # Google Gemma 2
   ollama pull mistral        # Mistral
   ```

4. 在插件中配置
   - AI 服务商：选择 `Ollama (本地)`
   - Ollama 服务地址：`http://localhost:11434`
   - 模型名称：`qwen2:7b`

5. 保存并测试 ✅

**模型推荐：**
| 模型 | 大小 | 特点 | 适合场景 |
|------|------|------|---------|
| qwen2:7b | 4.4GB | 中文优秀，速度快 | 翻译、总结（推荐） |
| llama3.1:8b | 4.7GB | 英文优秀 | 英文翻译 |
| gemma2:9b | 5.5GB | 平衡性好 | 通用 |
| qwen2:0.5b | 352MB | 超小超快 | 快速测试 |

### 🌐 方案2: 使用代理访问 OpenAI

如果你有 VPN 或海外代理：

**方法 A: 使用系统代理**
1. 启动你的 VPN/代理软件
2. 确保系统代理已开启
3. 在插件中使用默认 OpenAI 配置
4. API Base URL 保持：`https://api.openai.com/v1`

**方法 B: 使用 API 代理服务**
1. 获取一个 OpenAI API 代理地址
2. 在插件设置中：
   - AI 服务商：`OpenAI`
   - API Key：你的 OpenAI Key
   - API Base URL：改为代理地址（如 `https://your-proxy.com/v1`）

**常见代理服务商：**
- OpenAI-Forward (开源自建)
- API2D (国内中转)
- OhMyGPT
- 其他第三方服务

### 🇨🇳 方案3: 使用国内 AI 服务

使用国内可直接访问的 AI 服务：

#### 智谱 AI (ChatGLM)
```
AI 服务商：自定义API
API Base URL: https://open.bigmodel.cn/api/paas/v4
API Key: 你的智谱 API Key
模型名称: glm-4
```
获取: https://open.bigmodel.cn/

#### 阿里云百炼
```
AI 服务商：自定义API
API Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
API Key: 你的阿里云 API Key
模型名称: qwen-turbo
```
获取: https://bailian.console.aliyun.com/

#### DeepSeek
```
AI 服务商：自定义API
API Base URL: https://api.deepseek.com/v1
API Key: 你的 DeepSeek API Key
模型名称: deepseek-chat
```
获取: https://platform.deepseek.com/

#### Moonshot AI (Kimi)
```
AI 服务商：自定义API
API Base URL: https://api.moonshot.cn/v1
API Key: 你的 Moonshot API Key
模型名称: moonshot-v1-8k
```
获取: https://platform.moonshot.cn/

## 🧪 测试连接

配置完成后：
1. 点击"保存设置"
2. 点击"测试连接"
3. 如果失败，点击"诊断工具"查看详细日志

## 🔍 故障排查

### 问题：域名被解析到 198.18.x.x

**原因：** DNS 污染

**解决：**
- 使用本地 Ollama（无需网络）
- 使用代理
- 使用国内 AI 服务
- 修改 API Base URL

### 问题：Failed to fetch / 网络错误

**可能原因：**
1. 网络连接问题
2. 防火墙拦截
3. 代理配置错误

**解决：**
```bash
# 测试网络连接
curl https://api.openai.com/v1/models

# 测试 Ollama
curl http://localhost:11434

# 查看代理设置
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

### 问题：Ollama connection refused

**解决：**
```bash
# 确认 Ollama 已启动
ollama serve

# 在另一个终端测试
curl http://localhost:11434

# 应该返回：Ollama is running
```

### 问题：API Key 错误

**检查：**
- OpenAI Key 应该以 `sk-` 或 `sk-proj-` 开头
- Claude Key 应该以 `sk-ant-` 开头
- 确认 Key 未过期且有余额

## 📊 性能对比

| 方案 | 成本 | 速度 | 隐私 | 限制 |
|------|------|------|------|------|
| Ollama (本地) | 免费 | 快 | 最高 | 无 |
| OpenAI (海外) | 按量付费 | 快 | 中 | 需代理 |
| 国内 AI | 按量付费 | 快 | 中 | 有免费额度 |

## 💡 建议配置

**日常使用：**
- 主力：Ollama (qwen2:7b) - 免费快速
- 备用：国内 AI 服务 - 应对复杂任务

**高质量需求：**
- OpenAI GPT-4（需代理）
- Claude 3 Opus（需代理）

**预算有限：**
- 纯 Ollama 方案
- 或 Ollama + 国内服务少量免费额度

## 🔗 相关链接

- Ollama 官网: https://ollama.com/
- Ollama 模型库: https://ollama.com/library
- OpenAI 平台: https://platform.openai.com/
- Claude 控制台: https://console.anthropic.com/
- 智谱 AI: https://open.bigmodel.cn/
- DeepSeek: https://platform.deepseek.com/
