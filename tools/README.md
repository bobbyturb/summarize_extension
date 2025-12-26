# Chrome 扩展 Service Worker 网络隔离问题解决方案

## 问题描述

如果你遇到以下情况：
- ✅ 终端 `curl` 访问 API 正常
- ✅ Chrome 浏览器直接访问 API 正常
- ❌ Chrome 扩展插件无法访问 API

这是由于 **Manifest V3 的 Service Worker 网络隔离**导致的。Service Worker 可能不继承浏览器的代理设置和网络环境。

## 解决方案：使用本地代理

我们提供了一个简单的本地代理脚本，它在本地运行，转发扩展的请求到 OpenAI API。

### 方案优势
- ✅ 无需修改扩展代码
- ✅ 继承系统/终端的网络环境
- ✅ 简单易用，一个命令启动
- ✅ 支持 CORS，完美适配扩展

## 快速开始

### 第一步：启动本地代理

打开终端，进入项目目录，运行：

```bash
cd browser-extension/tools
python3 local-proxy.py
```

你会看到：
```
╔══════════════════════════════════════════════════════╗
║   OpenAI API 本地代理已启动                          ║
║                                                      ║
║   监听地址: http://127.0.0.1:8765                    ║
║                                                      ║
║   在插件设置中配置:                                   ║
║   API Base URL: http://127.0.0.1:8765/v1             ║
║                                                      ║
║   按 Ctrl+C 停止服务                                 ║
╚══════════════════════════════════════════════════════╝
```

**保持这个终端窗口运行**（不要关闭）。

### 第二步：配置插件

1. 打开插件设置页面
2. 选择 AI 服务商：**OpenAI**
3. 填写你的 OpenAI API Key
4. **重要**：修改 API Base URL 为：
   ```
   http://127.0.0.1:8765/v1
   ```
5. 选择模型（如 gpt-3.5-turbo）
6. 点击"保存设置"
7. 点击"测试连接"

### 第三步：开始使用

现在插件应该可以正常工作了！

- 打开任意网页
- 点击插件 → 打开侧边栏
- 使用翻译或总结功能

## 工作原理

```
Chrome 扩展 Service Worker
    ↓ (无法直接访问)
    ✗ https://api.openai.com

Chrome 扩展 Service Worker
    ↓ (通过本地代理)
    ✓ http://127.0.0.1:8765/v1
        ↓ (代理转发，使用系统网络)
        ✓ https://api.openai.com
```

本地代理运行在主机网络环境中，继承了你的代理/VPN 设置，因此可以正常访问 OpenAI。

## 日志查看

代理服务会实时显示请求日志：

```
[代理] 转发请求: https://api.openai.com/v1/chat/completions
[代理] 转发成功: 200
```

如果出错，也会显示错误信息：
```
[代理] API 错误: 401
[代理] 异常: Incorrect API key
```

## 高级配置

### 修改端口

如果 8765 端口被占用，可以修改代理脚本中的 `PORT` 变量：

```python
PORT = 8888  # 改为其他端口
```

然后在插件设置中使用相应的端口：
```
http://127.0.0.1:8888/v1
```

### 后台运行

**Linux/macOS:**
```bash
# 后台运行
nohup python3 local-proxy.py > proxy.log 2>&1 &

# 查看日志
tail -f proxy.log

# 停止服务
pkill -f local-proxy.py
```

**使用 systemd (Linux):**

创建服务文件 `/etc/systemd/system/openai-proxy.service`:
```ini
[Unit]
Description=OpenAI Local Proxy
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/browser-extension/tools
ExecStart=/usr/bin/python3 local-proxy.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl start openai-proxy
sudo systemctl enable openai-proxy  # 开机自启
```

### 添加认证（可选）

如果担心安全问题，可以添加简单的 token 认证：

```python
PROXY_TOKEN = "your-secret-token"

class ProxyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 验证 token
        if self.headers.get('X-Proxy-Token') != PROXY_TOKEN:
            self.send_response(403)
            self.end_headers()
            return

        # ... 原有代码 ...
```

## 其他解决方案

### 方案 A: 使用 Ollama（推荐）

如果你不想运行代理，使用 Ollama 是最简单的方案：
- 完全本地，无需网络
- 查看 [QUICK_START_CN.md](../QUICK_START_CN.md)

### 方案 B: 使用国内 AI 服务

使用国内可直接访问的服务：
- 智谱 AI、DeepSeek、通义千问等
- 查看 [API_CONFIG_GUIDE.md](../API_CONFIG_GUIDE.md)

### 方案 C: 使用 Node.js 代理

如果你熟悉 Node.js，也可以用它创建代理：

```javascript
// proxy.js
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8765;
const TARGET = 'https://api.openai.com';

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 转发请求
  const targetUrl = url.parse(TARGET + req.url);
  const options = {
    hostname: targetUrl.hostname,
    path: targetUrl.path,
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'],
      'Authorization': req.headers['authorization']
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`代理运行在 http://127.0.0.1:${PORT}`);
});
```

运行：
```bash
node proxy.js
```

## 常见问题

### Q: 代理启动失败，提示端口占用

**解决：** 修改端口号或关闭占用端口的程序

```bash
# 查看端口占用
lsof -i :8765  # macOS/Linux
netstat -ano | findstr :8765  # Windows

# 杀死占用进程
kill -9 <PID>
```

### Q: 插件提示 "Failed to fetch"

**原因：** 可能是代理服务未启动

**解决：**
1. 确认代理服务正在运行
2. 在浏览器访问 `http://127.0.0.1:8765` 测试
3. 检查防火墙是否拦截

### Q: 代理可以访问，但 API 调用失败

**检查：**
1. API Key 是否正确
2. 终端的代理设置是否生效
3. 查看代理服务的日志输出

### Q: 性能如何？

本地代理几乎没有额外延迟（<5ms），因为只是简单的转发。

### Q: 安全吗？

- ✅ 代理只监听 127.0.0.1（localhost），外部无法访问
- ✅ 不存储或记录任何数据
- ✅ 直接转发请求，不修改内容
- ⚠️ API Key 会通过代理传输（在本地回环接口）

## 总结

对于你的情况（终端和浏览器都能访问，但扩展不能），使用本地代理是最简单有效的解决方案：

**优点：**
- ✅ 5 分钟解决问题
- ✅ 无需复杂配置
- ✅ 继承现有网络环境
- ✅ 几乎无性能损失

**使用流程：**
1. 启动代理：`python3 local-proxy.py`
2. 配置插件使用代理地址
3. 正常使用

**保持代理运行：**
- 使用代理期间，保持终端窗口打开
- 或使用后台运行方式（nohup 或 systemd）

---

**快速启动命令：**
```bash
cd browser-extension/tools
python3 local-proxy.py
```

然后在插件设置中：
- API Base URL: `http://127.0.0.1:8765/v1`
