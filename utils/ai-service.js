/**
 * AI服务统一接口
 * 支持 OpenAI, Anthropic, Google Gemini, Ollama 和自定义API
 */

class AIService {
  constructor(config) {
    this.provider = config.provider;
    this.config = config;
  }

  /**
   * 调用AI进行文本处理
   * @param {string} prompt - 提示词
   * @param {string} userMessage - 用户消息
   * @returns {Promise<string>} AI响应
   */
  async chat(prompt, userMessage) {
    switch (this.provider) {
      case 'openai':
        return await this.callOpenAI(prompt, userMessage);
      case 'anthropic':
        return await this.callAnthropic(prompt, userMessage);
      case 'gemini':
        return await this.callGemini(prompt, userMessage);
      case 'ollama':
        return await this.callOllama(prompt, userMessage);
      case 'custom':
        return await this.callCustomAPI(prompt, userMessage);
      default:
        throw new Error('不支持的AI服务商: ' + this.provider);
    }
  }

  /**
   * 调用 OpenAI API
   */
  async callOpenAI(systemPrompt, userMessage) {
    const { apiKey, model, baseUrl } = this.config;
    console.log('[OpenAI] 调用 API:', { model, baseUrl });

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7
        })
      });

      console.log('[OpenAI] 响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OpenAI] API 错误响应:', errorText);

        try {
          const error = JSON.parse(errorText);
          throw new Error(error.error?.message || 'OpenAI API调用失败');
        } catch (e) {
          throw new Error(`OpenAI API调用失败 (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('[OpenAI] 调用成功');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('[OpenAI] 调用异常:', error);
      throw error;
    }
  }

  /**
   * 调用 Anthropic Claude API
   */
  async callAnthropic(systemPrompt, userMessage) {
    const { apiKey, model } = this.config;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API调用失败');
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * 调用 Google Gemini API
   */
  async callGemini(systemPrompt, userMessage) {
    const { apiKey, model } = this.config;

    const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API调用失败');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * 调用 Ollama (本地AI)
   */
  async callOllama(systemPrompt, userMessage) {
    const { baseUrl, model } = this.config;
    console.log('[Ollama] 调用本地 API:', { baseUrl, model });

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          stream: false
        })
      });

      console.log('[Ollama] 响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Ollama] API 错误响应:', errorText);
        throw new Error(`Ollama API调用失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('[Ollama] 调用成功');
      return data.message.content;
    } catch (error) {
      console.error('[Ollama] 调用异常:', error);

      // 检查是否是网络错误
      if (error.message.includes('fetch')) {
        throw new Error(`无法连接到 Ollama 服务 (${baseUrl})。请确保 Ollama 已启动并运行在 ${baseUrl}`);
      }

      throw error;
    }
  }

  /**
   * 调用自定义API (OpenAI兼容格式)
   */
  async callCustomAPI(systemPrompt, userMessage) {
    const { baseUrl, apiKey, model } = this.config;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('自定义API调用失败: ' + response.statusText);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 测试连接
   */
  async testConnection() {
    try {
      const response = await this.chat(
        'You are a helpful assistant.',
        'Say "Hello" in one word.'
      );
      return { success: true, message: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * 从存储中创建AI服务实例
 */
async function createAIService() {
  console.log('[AI Service] 开始从存储加载配置...');

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
    }
  });

  const provider = settings.aiProvider;
  console.log('[AI Service] 当前选择的服务商:', provider);

  const config = {
    provider: provider,
    ...settings[provider]
  };

  // 打印配置信息（隐藏敏感信息）
  const safeConfig = { ...config };
  if (safeConfig.apiKey) {
    safeConfig.apiKey = safeConfig.apiKey.substring(0, 8) + '...';
  }
  console.log('[AI Service] 服务配置:', safeConfig);

  // 验证配置
  if (provider === 'openai' && !config.apiKey) {
    throw new Error('请先在设置中配置OpenAI API Key');
  }
  if (provider === 'anthropic' && !config.apiKey) {
    throw new Error('请先在设置中配置Anthropic API Key');
  }
  if (provider === 'gemini' && !config.apiKey) {
    throw new Error('请先在设置中配置Gemini API Key');
  }
  if (provider === 'ollama' && !config.model) {
    throw new Error('请先在设置中配置Ollama模型名称');
  }
  if (provider === 'custom' && (!config.baseUrl || !config.model)) {
    throw new Error('请先在设置中配置自定义API');
  }

  console.log('[AI Service] 配置验证通过，创建服务实例');
  return new AIService(config);
}

// 导出（用于其他脚本）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIService, createAIService };
}
