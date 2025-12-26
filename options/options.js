// AI服务商配置区域映射
const providerConfigs = {
  'openai': 'openai-config',
  'anthropic': 'anthropic-config',
  'gemini': 'gemini-config',
  'ollama': 'ollama-config',
  'custom': 'custom-config'
};

// 加载已保存的设置
async function loadSettings() {
  const settings = await chrome.storage.sync.get({
    aiProvider: 'openai',
    openai: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      baseUrl: 'https://api.openai.com/v1'
    },
    anthropic: {
      apiKey: '',
      model: 'claude-3-haiku-20240307'
    },
    gemini: {
      apiKey: '',
      model: 'gemini-pro'
    },
    ollama: {
      baseUrl: 'http://localhost:11434',
      model: 'qwen2:7b'
    },
    custom: {
      baseUrl: '',
      apiKey: '',
      model: ''
    },
    customSummaryPrompt: ''
  });

  // 设置服务商选择
  document.getElementById('aiProvider').value = settings.aiProvider;
  showProviderConfig(settings.aiProvider);

  // 加载 OpenAI 设置
  document.getElementById('openai-apiKey').value = settings.openai.apiKey;
  document.getElementById('openai-model').value = settings.openai.model;
  document.getElementById('openai-baseUrl').value = settings.openai.baseUrl;

  // 加载 Anthropic 设置
  document.getElementById('anthropic-apiKey').value = settings.anthropic.apiKey;
  document.getElementById('anthropic-model').value = settings.anthropic.model;

  // 加载 Gemini 设置
  document.getElementById('gemini-apiKey').value = settings.gemini.apiKey;
  document.getElementById('gemini-model').value = settings.gemini.model;

  // 加载 Ollama 设置
  document.getElementById('ollama-baseUrl').value = settings.ollama.baseUrl;
  document.getElementById('ollama-model').value = settings.ollama.model;

  // 加载自定义设置
  document.getElementById('custom-baseUrl').value = settings.custom.baseUrl;
  document.getElementById('custom-apiKey').value = settings.custom.apiKey;
  document.getElementById('custom-model').value = settings.custom.model;

  // 加载自定义总结提示词
  document.getElementById('customSummaryPrompt').value = settings.customSummaryPrompt || '';
}

// 显示对应的服务商配置区域
function showProviderConfig(provider) {
  // 隐藏所有配置区域
  Object.values(providerConfigs).forEach(configId => {
    document.getElementById(configId).style.display = 'none';
  });

  // 显示选中的配置区域
  if (providerConfigs[provider]) {
    document.getElementById(providerConfigs[provider]).style.display = 'block';
  }
}

// 服务商切换事件
document.getElementById('aiProvider').addEventListener('change', (e) => {
  showProviderConfig(e.target.value);
});

// 保存设置
document.getElementById('saveBtn').addEventListener('click', async () => {
  const provider = document.getElementById('aiProvider').value;

  const settings = {
    aiProvider: provider,
    openai: {
      apiKey: document.getElementById('openai-apiKey').value,
      model: document.getElementById('openai-model').value,
      baseUrl: document.getElementById('openai-baseUrl').value
    },
    anthropic: {
      apiKey: document.getElementById('anthropic-apiKey').value,
      model: document.getElementById('anthropic-model').value
    },
    gemini: {
      apiKey: document.getElementById('gemini-apiKey').value,
      model: document.getElementById('gemini-model').value
    },
    ollama: {
      baseUrl: document.getElementById('ollama-baseUrl').value,
      model: document.getElementById('ollama-model').value
    },
    custom: {
      baseUrl: document.getElementById('custom-baseUrl').value,
      apiKey: document.getElementById('custom-apiKey').value,
      model: document.getElementById('custom-model').value
    },
    customSummaryPrompt: document.getElementById('customSummaryPrompt').value
  };

  try {
    await chrome.storage.sync.set(settings);
    showStatus('设置已保存', 'success');
  } catch (error) {
    showStatus('保存失败: ' + error.message, 'error');
  }
});

// 测试连接
document.getElementById('testBtn').addEventListener('click', async () => {
  showStatus('正在测试连接...', 'success');
  console.log('[Options] 开始测试连接');

  try {
    console.log('[Options] 发送测试连接消息到 background');
    const response = await chrome.runtime.sendMessage({
      action: 'testConnection'
    });

    console.log('[Options] 收到测试响应:', response);

    if (response.success) {
      showStatus('连接成功！AI服务运行正常\n响应: ' + response.message, 'success');
    } else {
      let errorMsg = '连接失败: ' + response.error;
      if (response.details) {
        console.error('[Options] 详细错误:', response.details);
      }
      showStatus(errorMsg, 'error');
    }
  } catch (error) {
    console.error('[Options] 测试失败:', error);
    showStatus('测试失败: ' + error.message, 'error');
  }
});

// 打开诊断工具
document.getElementById('diagnosticBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'options/diagnostic.html' });
});

// 打开API配置指南
document.getElementById('openApiGuide').addEventListener('click', (e) => {
  e.preventDefault();
  // 在新标签页打开README文档
  chrome.tabs.create({ url: chrome.runtime.getURL('README.md') });
});

// 显示状态消息
function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = 'status-message ' + type;

  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// 页面加载时加载设置
loadSettings();
