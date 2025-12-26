/**
 * Background Service Worker
 * 处理API调用和消息路由
 */

// 导入 AI 服务（注意：Service Worker 需要使用 importScripts）
importScripts('/utils/ai-service.js');

// 监听来自 sidebar 和 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    handleTranslate(request).then(sendResponse);
    return true; // 异步响应
  } else if (request.action === 'summarize') {
    handleSummarize(request).then(sendResponse);
    return true;
  } else if (request.action === 'testConnection') {
    handleTestConnection().then(sendResponse);
    return true;
  }
});

/**
 * 处理翻译请求
 */
async function handleTranslate(request) {
  try {
    const { text, targetLang } = request;

    if (!text || text.trim().length === 0) {
      return { success: false, error: '文本内容为空' };
    }

    // 创建 AI 服务实例
    const aiService = await createAIService();

    // 构建翻译提示词
    const systemPrompt = `你是一个专业的翻译助手。请将用户提供的文本翻译成${getLanguageName(targetLang)}。
要求：
1. 保持原文的语气和风格
2. 确保翻译准确、流畅
3. 对于专业术语，提供准确的翻译
4. 只返回翻译结果，不要添加额外的解释`;

    // 调用 AI 进行翻译
    const result = await aiService.chat(systemPrompt, text);

    return {
      success: true,
      result: result
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 处理总结请求
 */
async function handleSummarize(request) {
  try {
    const { text, length, pageTitle } = request;

    if (!text || text.trim().length === 0) {
      return { success: false, error: '文本内容为空' };
    }

    // 创建 AI 服务实例
    const aiService = await createAIService();

    let systemPrompt;

    // 如果选择自定义，尝试使用用户配置的自定义prompt
    if (length === 'custom') {
      const settings = await chrome.storage.sync.get('customSummaryPrompt');
      const customPrompt = settings.customSummaryPrompt;

      if (customPrompt && customPrompt.trim()) {
        systemPrompt = customPrompt.trim();
      } else {
        // 如果没有配置自定义prompt，使用默认的详细总结
        systemPrompt = `你是一个专业的内容总结助手。请对用户提供的网页内容进行总结。

要求：
1. 总结长度：500字左右
2. 提取核心观点和关键信息
3. 保持逻辑清晰、条理分明
4. 使用简洁明了的语言
5. 如果内容包含多个主题，分点总结
6. 使用中文输出`;
      }
    } else {
      // 根据长度要求设置字数
      const lengthMap = {
        'short': '150字以内',
        'medium': '300字左右',
        'detailed': '500字左右'
      };

      const lengthRequirement = lengthMap[length] || lengthMap['medium'];

      // 构建总结提示词
      systemPrompt = `你是一个专业的内容总结助手。请对用户提供的网页内容进行总结。

要求：
1. 总结长度：${lengthRequirement}
2. 提取核心观点和关键信息
3. 保持逻辑清晰、条理分明
4. 使用简洁明了的语言
5. 如果内容包含多个主题，分点总结
6. 使用中文输出`;
    }

    const userMessage = `页面标题：${pageTitle || '未知'}\n\n页面内容：\n${text}`;

    // 调用 AI 进行总结
    const result = await aiService.chat(systemPrompt, userMessage);

    return {
      success: true,
      result: result
    };

  } catch (error) {
    console.error('Summary error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 测试 AI 连接
 */
async function handleTestConnection() {
  console.log('[Test Connection] 开始测试连接...');

  try {
    console.log('[Test Connection] 正在创建 AI 服务实例...');
    const aiService = await createAIService();

    console.log('[Test Connection] AI 服务实例创建成功，开始测试连接...');
    const result = await aiService.testConnection();

    console.log('[Test Connection] 测试结果:', result);
    return result;
  } catch (error) {
    console.error('[Test Connection] 测试失败:', error);
    console.error('[Test Connection] 错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}

/**
 * 获取语言名称
 */
function getLanguageName(code) {
  const languageMap = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en': '英语',
    'ja': '日语',
    'ko': '韩语',
    'fr': '法语',
    'de': '德语',
    'es': '西班牙语',
    'ru': '俄语',
    'ar': '阿拉伯语',
    'pt': '葡萄牙语',
    'it': '意大利语'
  };

  return languageMap[code] || code;
}

// 扩展安装或更新时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AI翻译与总结助手已安装');
    // 可以打开欢迎页面或设置页面
    chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update') {
    console.log('AI翻译与总结助手已更新');
  }

  // 创建右键菜单
  chrome.contextMenus.create({
    id: 'translate-selection',
    title: '翻译选中文本',
    contexts: ['selection']
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection') {
    console.log('[Background] 右键菜单被点击，选中的文本:', info.selectionText);

    // 立即打开侧边栏（在用户手势上下文中同步调用）
    chrome.sidePanel.open({ windowId: tab.windowId });

    console.log('[Background] 侧边栏已打开，保存待处理动作');

    // 保存待执行的动作和选中的文本（异步操作，不等待）
    chrome.storage.local.set({
      pendingAction: {
        type: 'translateSelection',
        text: info.selectionText,
        timestamp: Date.now()
      }
    }).then(() => {
      console.log('[Background] 待处理动作已保存');
    });
  }
});

console.log('AI翻译与总结助手 Background Service 已启动');
