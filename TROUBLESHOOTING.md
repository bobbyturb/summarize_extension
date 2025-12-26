# 快速故障排查清单

> 🇨🇳 **中国大陆用户遇到 DNS 污染（198.18.x.x）？** 直接查看 → [快速入门指南](QUICK_START_CN.md)

当测试连接失败时，按照以下步骤排查：

## ⚠️ 特别提示：域名被解析到 198.18.x.x

如果在 Background Service Worker 日志中看到类似信息：
```
域名被解析到 198.18.1.150:443
Failed to fetch
```

这是 **DNS 污染** 导致的，常见于中国大陆访问 OpenAI、Claude 等海外服务。

**快速解决：**
1. **推荐**：使用 Ollama 本地 AI → [5分钟快速入门](QUICK_START_CN.md)
2. 使用国内 AI 服务 → [API 配置指南](API_CONFIG_GUIDE.md)
3. 使用代理访问 → [API 配置指南](API_CONFIG_GUIDE.md)

---


## ✅ 第一步：使用诊断工具

1. 打开设置页面（点击插件图标 → 设置）
2. 点击"诊断工具"按钮
3. 查看配置状态表格，确认所有必需项都是 ✓ 已配置
4. 点击"测试 AI 连接"
5. 查看"诊断结果"区域的日志输出

## ✅ 第二步：查看 Background Service 日志

1. 打开新标签页
2. 访问 `chrome://extensions/`
3. 找到 "AI翻译与总结助手"
4. 点击 "service worker" 链接（在"检查视图"下方）
5. 查看 Console 标签中的日志

### 正常日志示例：
```
[Test Connection] 开始测试连接...
[AI Service] 当前选择的服务商: openai
[AI Service] 服务配置: {...}
[OpenAI] 调用 API: {...}
[OpenAI] 响应状态: 200
[OpenAI] 调用成功
```

### 错误日志示例：
```
[OpenAI] 响应状态: 401
[OpenAI] API 错误响应: {"error": {"message": "Incorrect API key"}}
```

## ✅ 第三步：针对性排查

### 如果是 OpenAI

**错误: "Incorrect API key"**
- 检查 API Key 是否正确（应该以 `sk-` 开头）
- 在 https://platform.openai.com/api-keys 检查 Key 是否有效
- 检查账户余额: https://platform.openai.com/usage

**错误: "Rate limit reached"**
- 等待几分钟后重试
- 或升级 OpenAI 账户等级

**错误: "Network error" 或 "Failed to fetch"**
- 检查网络连接
- 如果在中国大陆，可能需要配置代理
- 在设置中修改 "API Base URL" 为代理地址

### 如果是 Ollama

**错误: "无法连接到 Ollama 服务"**

1. 确认 Ollama 已安装
   ```bash
   ollama --version
   ```

2. 启动 Ollama 服务
   ```bash
   ollama serve
   ```

3. 测试服务是否运行
   - 在浏览器访问: `http://localhost:11434`
   - 应该看到 "Ollama is running"

4. 确认已下载模型
   ```bash
   ollama list
   ```
   如果没有模型，下载一个:
   ```bash
   ollama pull llama2
   ```

5. 在设置中确认:
   - 服务地址: `http://localhost:11434`
   - 模型名称: `llama2` (或你已下载的模型名)

### 如果是 Claude (Anthropic)

**错误: "Invalid API key"**
- 在 https://console.anthropic.com 检查 API Key
- Key 应该以 `sk-ant-` 开头

**错误: "Rate limit"**
- 等待后重试
- 检查账户使用限额

### 如果是 Gemini

**错误: "API key not valid"**
- 在 https://makersuite.google.com/app/apikey 检查 Key
- 确认已启用 Gemini API

## ✅ 第四步：通用检查

### 检查浏览器权限
1. 访问 `chrome://extensions/`
2. 找到插件
3. 确认所有权限已授予

### 清除缓存重试
1. 打开诊断工具
2. 点击"清除配置"
3. 重新配置 AI 服务
4. 再次测试

### 检查网络连接
```javascript
// 在 Background Service Worker 控制台执行
fetch('https://api.openai.com/v1/models')
  .then(r => console.log('网络正常', r.status))
  .catch(e => console.log('网络错误', e))
```

## ✅ 第五步：收集信息寻求帮助

如果以上步骤都无法解决，收集以下信息：

1. Chrome 版本（访问 `chrome://version/`）
2. 使用的 AI 服务商
3. Background Service Worker 完整日志（复制控制台全部内容）
4. 诊断工具的截图
5. 错误消息截图

然后：
- 查看 GitHub Issues 是否有类似问题
- 提交新 Issue 并附上上述信息

## 📋 配置检查清单

使用前确认：

- [ ] 已安装插件到 Chrome
- [ ] 已打开设置页面
- [ ] 已选择 AI 服务商
- [ ] 已填写 API Key 或服务地址
- [ ] 已点击"保存设置"
- [ ] 测试连接成功

## 🔧 常用调试命令

在 Background Service Worker 控制台中：

```javascript
// 查看当前配置
chrome.storage.sync.get(null, (data) => console.log('配置:', data));

// 测试连接
chrome.runtime.sendMessage({action: 'testConnection'},
  (response) => console.log('测试结果:', response));

// 清除配置
chrome.storage.sync.clear(() => console.log('已清除'));
```

## 📞 获取更多帮助

- 📖 详细调试指南: `DEBUG_GUIDE.md`
- 📖 项目说明: `README.md`
- 🐛 报告问题: GitHub Issues
