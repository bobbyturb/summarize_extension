// 加载配置信息
async function loadConfiguration() {
  const settings = await chrome.storage.sync.get(null);

  const configBody = document.getElementById('configBody');
  configBody.innerHTML = '';

  // 显示当前 AI 服务商
  addConfigRow('AI 服务商', settings.aiProvider || '未设置', settings.aiProvider ? 'success' : 'error');

  // 根据服务商显示对应配置
  const provider = settings.aiProvider;
  if (provider && settings[provider]) {
    const config = settings[provider];

    if (provider === 'openai') {
      addConfigRow('OpenAI API Key', config.apiKey ? maskApiKey(config.apiKey) : '未设置', config.apiKey ? 'success' : 'error');
      addConfigRow('模型', config.model || '未设置', config.model ? 'success' : 'warning');
      addConfigRow('Base URL', config.baseUrl || '未设置', 'success');
    } else if (provider === 'anthropic') {
      addConfigRow('Claude API Key', config.apiKey ? maskApiKey(config.apiKey) : '未设置', config.apiKey ? 'success' : 'error');
      addConfigRow('模型', config.model || '未设置', config.model ? 'success' : 'warning');
    } else if (provider === 'gemini') {
      addConfigRow('Gemini API Key', config.apiKey ? maskApiKey(config.apiKey) : '未设置', config.apiKey ? 'success' : 'error');
      addConfigRow('模型', config.model || '未设置', config.model ? 'success' : 'warning');
    } else if (provider === 'ollama') {
      addConfigRow('Ollama 服务地址', config.baseUrl || '未设置', config.baseUrl ? 'success' : 'error');
      addConfigRow('模型名称', config.model || '未设置', config.model ? 'success' : 'error');
    } else if (provider === 'custom') {
      addConfigRow('API Base URL', config.baseUrl || '未设置', config.baseUrl ? 'success' : 'error');
      addConfigRow('API Key', config.apiKey ? maskApiKey(config.apiKey) : '（可选）', 'success');
      addConfigRow('模型名称', config.model || '未设置', config.model ? 'success' : 'error');
    }
  }
}

function addConfigRow(name, value, status) {
  const tbody = document.getElementById('configBody');
  const tr = document.createElement('tr');

  const statusBadge = status === 'success' ? '<span class="badge success">✓ 已配置</span>' :
                     status === 'error' ? '<span class="badge error">✗ 未配置</span>' :
                     '<span class="badge warning">⚠ 可选</span>';

  tr.innerHTML = `
    <td>${name}</td>
    <td>${value}</td>
    <td>${statusBadge}</td>
  `;

  tbody.appendChild(tr);
}

function maskApiKey(key) {
  if (!key || key.length < 10) return key;
  return key.substring(0, 8) + '...' + key.substring(key.length - 4);
}

// 测试连接
document.getElementById('testConnection').addEventListener('click', async () => {
  showStatus('正在测试连接...', 'loading');
  log('[诊断] 开始测试 AI 连接');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'testConnection'
    });

    log('[诊断] 测试响应: ' + JSON.stringify(response, null, 2));

    if (response.success) {
      showStatus('✓ 连接成功！AI 服务运行正常', 'success');
      log('[诊断] 测试成功');
      log('AI 响应: ' + response.message);
    } else {
      showStatus('✗ 连接失败: ' + response.error, 'error');
      log('[诊断] 测试失败: ' + response.error);
      if (response.details) {
        log('详细错误:\n' + response.details);
      }
    }
  } catch (error) {
    showStatus('✗ 测试异常: ' + error.message, 'error');
    log('[诊断] 测试异常: ' + error.message);
    log('错误堆栈:\n' + error.stack);
  }
});

// 检查存储
document.getElementById('checkStorage').addEventListener('click', async () => {
  showStatus('正在检查存储...', 'loading');
  log('[诊断] 检查 Chrome Storage');

  try {
    const settings = await chrome.storage.sync.get(null);
    log('[诊断] Storage 内容:');
    log(JSON.stringify(settings, null, 2));
    showStatus('✓ 存储检查完成，详情见下方', 'success');
  } catch (error) {
    showStatus('✗ 检查存储失败: ' + error.message, 'error');
    log('[诊断] 检查失败: ' + error.message);
  }
});

// 查看后台日志提示
document.getElementById('viewLogs').addEventListener('click', () => {
  log('[诊断] 查看后台日志步骤:');
  log('1. 打开新标签页，访问: chrome://extensions/');
  log('2. 找到 "AI翻译与总结助手"');
  log('3. 点击 "检查视图" 下的 "service worker" 链接');
  log('4. 在打开的控制台中查看日志');
  log('');
  log('你将看到类似这样的日志:');
  log('[Test Connection] 开始测试连接...');
  log('[AI Service] 当前选择的服务商: openai');
  log('[OpenAI] 调用 API: {...}');
  log('[OpenAI] 响应状态: 200');
  log('');
  showStatus('ℹ️ 详情请查看下方说明', 'loading');
});

// 清除配置
document.getElementById('clearConfig').addEventListener('click', async () => {
  if (!confirm('确定要清除所有配置吗？这将删除所有已保存的 API Key 和设置。')) {
    return;
  }

  showStatus('正在清除配置...', 'loading');
  log('[诊断] 清除所有配置');

  try {
    await chrome.storage.sync.clear();
    log('[诊断] 配置已清除');
    showStatus('✓ 配置已清除，请重新配置', 'success');
    setTimeout(() => {
      loadConfiguration();
    }, 1000);
  } catch (error) {
    showStatus('✗ 清除失败: ' + error.message, 'error');
    log('[诊断] 清除失败: ' + error.message);
  }
});

// 日志输出
function log(message) {
  const resultDiv = document.getElementById('diagnosticResult');
  const timestamp = new Date().toLocaleTimeString();
  resultDiv.textContent += `[${timestamp}] ${message}\n`;
  resultDiv.scrollTop = resultDiv.scrollHeight;
}

// 显示状态
function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;

  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 5000);
  }
}

// 页面加载时自动加载配置
loadConfiguration();
log('[诊断] 诊断工具已就绪');
log('点击上方按钮开始诊断');
