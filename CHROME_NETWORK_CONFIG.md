# Chrome 网络配置指南

## ⚠️ 特殊情况：终端和浏览器都能访问，但扩展不能

**如果你的情况是：**
- ✅ 终端 `curl` 可以访问 OpenAI API
- ✅ Chrome 浏览器直接访问 OpenAI 网站正常
- ❌ Chrome 扩展插件无法访问（DNS 污染或 Failed to fetch）

**这是 Manifest V3 Service Worker 网络隔离导致的！**

Service Worker 可能不继承浏览器的代理设置和网络环境。

### 🎯 推荐解决方案：使用本地代理

我们提供了一个简单的本地代理工具，完美解决这个问题。

**详细说明：** [tools/README.md](tools/README.md)

**快速开始：**

1. 启动代理服务（新终端）：
   ```bash
   cd browser-extension/tools
   python3 local-proxy.py
   ```

2. 在插件设置中配置：
   - AI 服务商：OpenAI
   - API Key：你的 OpenAI Key
   - **API Base URL：`http://127.0.0.1:8765/v1`**

3. 保存并测试连接 ✅

代理会在本地转发请求到 OpenAI，继承你的系统网络环境。

---

## 问题诊断

如果你发现：
- ✅ 终端 `curl` 访问 API 正常
- ❌ Chrome 插件访问 API 失败（DNS 污染）

说明 **Chrome 的网络配置与系统不同**。

## 检查和修复步骤

### 第一步：检查终端代理

```bash
# 查看是否配置了代理
echo $http_proxy
echo $https_proxy
echo $all_proxy

# 测试 OpenAI API
curl https://api.openai.com/v1/models -I
```

如果有输出代理地址（如 `http://127.0.0.1:7890`），说明终端使用了代理。

### 第二步：检查 Chrome 代理设置

#### 方法 A: 通过 Chrome 设置

1. 打开 Chrome 浏览器
2. 访问 `chrome://settings/`
3. 搜索 "代理"
4. 点击 "打开您计算机的代理设置"

**Windows:**
- 确保"使用代理服务器"已开启
- 地址和端口与终端代理一致

**macOS:**
- 系统设置 → 网络 → 高级 → 代理
- 确保勾选了需要的代理类型

**Linux:**
- 检查系统代理设置
- 或使用命令行启动 Chrome

#### 方法 B: 使用命令行启动 Chrome（临时测试）

**Linux:**
```bash
# 使用系统代理启动 Chrome
google-chrome --proxy-server="http://127.0.0.1:7890"

# 或使用环境变量
http_proxy=http://127.0.0.1:7890 https_proxy=http://127.0.0.1:7890 google-chrome
```

**macOS:**
```bash
# 使用代理启动 Chrome
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --proxy-server="http://127.0.0.1:7890"
```

**Windows (PowerShell):**
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --proxy-server="http://127.0.0.1:7890"
```

### 第三步：修改 Chrome DNS 设置

Chrome 可能使用了自己的 DNS over HTTPS，导致 DNS 污染。

1. 访问 `chrome://settings/security`
2. 找到 "使用安全 DNS" (Use secure DNS)
3. 尝试以下选项：

**选项 A: 关闭安全 DNS**
- 选择 "关闭"
- Chrome 将使用系统 DNS

**选项 B: 使用自定义 DNS**
- 选择 "使用" → "自定义"
- 填入可靠的 DNS over HTTPS 服务：
  ```
  https://1.1.1.1/dns-query        (Cloudflare)
  https://8.8.8.8/dns-query        (Google)
  https://223.5.5.5/dns-query      (阿里 DNS)
  https://dns.alidns.com/dns-query (阿里 DNS)
  ```

### 第四步：清除 Chrome DNS 缓存

1. 访问 `chrome://net-internals/#dns`
2. 点击 "Clear host cache"
3. 重启 Chrome

### 第五步：验证修复

1. 重新加载插件
2. 打开设置 → 点击"测试连接"
3. 查看 Background Service Worker 日志

## 常见场景解决方案

### 场景 1: 使用 Clash/V2ray 等代理软件

**问题：** 代理软件只代理了终端，没有代理浏览器。

**解决：**

1. 在代理软件中开启 "系统代理" 或 "TUN 模式"
2. 或在 Chrome 中手动配置代理：
   - 地址: `127.0.0.1`
   - 端口: 你的代理软件端口（常见：7890, 7891, 1080）

**Clash 示例配置：**
- HTTP 代理: `http://127.0.0.1:7890`
- SOCKS5 代理: `socks5://127.0.0.1:7891`

### 场景 2: 公司/学校网络

**问题：** 网络环境有特殊配置。

**解决：**
- 咨询网管获取代理配置
- 或使用 Ollama 本地方案（无需网络）

### 场景 3: 使用 VPN

**问题：** VPN 可能有分流规则。

**解决：**
- 确保 VPN 的 "全局模式" 已启用
- 或将 `api.openai.com` 添加到 VPN 的代理列表

### 场景 4: 系统 DNS 被修改

**问题：** 系统配置了特殊 DNS。

**检查：**
```bash
# Linux
cat /etc/resolv.conf

# macOS
scutil --dns

# Windows
ipconfig /all
```

**解决：**
- 修改系统 DNS 为可靠的公共 DNS
- 如 1.1.1.1 (Cloudflare) 或 8.8.8.8 (Google)

## 快速诊断脚本

创建一个测试脚本来对比：

```bash
#!/bin/bash

echo "=== 系统信息 ==="
uname -a

echo -e "\n=== 代理配置 ==="
echo "http_proxy: $http_proxy"
echo "https_proxy: $https_proxy"
echo "all_proxy: $all_proxy"

echo -e "\n=== DNS 配置 ==="
cat /etc/resolv.conf 2>/dev/null || echo "Windows 系统"

echo -e "\n=== 测试 OpenAI API (终端) ==="
curl -I https://api.openai.com/v1/models 2>&1 | head -5

echo -e "\n=== DNS 解析 ==="
nslookup api.openai.com 2>/dev/null || echo "需要安装 nslookup"

echo -e "\n=== 路由追踪 (前3跳) ==="
traceroute -m 3 api.openai.com 2>/dev/null || echo "需要安装 traceroute"
```

保存为 `network-test.sh`，运行：
```bash
chmod +x network-test.sh
./network-test.sh
```

## 在插件中使用代理

如果你已经有代理在运行，可以在插件设置中配置：

### OpenAI 使用代理

在插件设置中：
- AI 服务商：`OpenAI`
- API Key：你的 OpenAI Key
- API Base URL：改为你的代理地址

**示例：**
```
# 如果代理运行在本地 7890 端口
http://127.0.0.1:7890/v1

# 或使用代理转发服务
https://your-proxy-domain.com/v1
```

## 推荐：使用插件扩展代理

安装 Chrome 代理扩展，可以更灵活地控制浏览器流量：

1. **SwitchyOmega** (推荐)
   - 从 Chrome Web Store 安装
   - 配置代理规则
   - 让 OpenAI 域名走代理

2. **Proxy SwitchySharp**
   - 简单的代理切换工具

## 验证网络配置

在 Chrome 开发者工具中测试：

1. 按 F12 打开开发者工具
2. 切换到 Console 标签
3. 运行：

```javascript
// 测试网络请求
fetch('https://api.openai.com/v1/models', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-api-key'
  }
})
.then(response => {
  console.log('✓ 请求成功:', response.status);
  return response.json();
})
.then(data => console.log('数据:', data))
.catch(error => console.error('✗ 请求失败:', error));
```

如果这个请求成功，说明 Chrome 网络正常，问题可能在插件配置。

## 终极解决方案

如果以上方法都不行：

### 方案 A: 使用 Ollama（最简单）

不依赖网络，完全本地运行：
- 查看 [QUICK_START_CN.md](QUICK_START_CN.md)

### 方案 B: 使用国内 AI 服务

无需处理网络问题：
- 查看 [API_CONFIG_GUIDE.md](API_CONFIG_GUIDE.md)

### 方案 C: 自建 API 代理

如果你有海外服务器：

**使用 OpenAI-Forward:**
```bash
# 在海外服务器上
pip install openai-forward
openai-forward run --port 8000

# 然后在插件中配置
# API Base URL: http://your-server-ip:8000/v1
```

## 调试技巧

### 查看 Chrome 网络内部状态

访问以下 Chrome 内部页面：

1. **chrome://net-internals/#proxy**
   - 查看代理配置状态

2. **chrome://net-internals/#dns**
   - 查看 DNS 缓存
   - 清除 DNS 缓存

3. **chrome://net-internals/#sockets**
   - 查看活动连接
   - 刷新 socket 池

4. **chrome://net-export/**
   - 导出网络日志进行分析

## 常见错误对照表

| 终端 curl 结果 | Chrome 插件结果 | 可能原因 | 解决方案 |
|---------------|----------------|---------|---------|
| ✅ 成功 | ❌ DNS 污染 | Chrome DNS 设置问题 | 修改 Chrome DNS 设置 |
| ✅ 成功 | ❌ Failed to fetch | Chrome 没有使用代理 | 配置 Chrome 系统代理 |
| ✅ 成功 | ❌ 401 错误 | API Key 配置问题 | 检查插件设置 |
| ✅ 成功 | ✅ 成功 | 都正常 | 无问题 |

## 总结

**核心问题：** Chrome 的网络配置与终端不同。

**最佳解决方案：**
1. 确保 Chrome 使用系统代理
2. 或修改 Chrome DNS 设置
3. 或使用 Ollama 本地方案（彻底避免网络问题）

**验证步骤：**
1. 检查终端代理配置
2. 配置 Chrome 使用相同代理
3. 清除 Chrome DNS 缓存
4. 重新测试插件

需要更详细的帮助，请提供：
- 操作系统
- 代理软件（如 Clash、V2ray）
- `echo $https_proxy` 的输出
- Chrome 版本
