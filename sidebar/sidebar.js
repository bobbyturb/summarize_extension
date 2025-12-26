// 标签页切换
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;

    // 切换按钮状态
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 切换内容
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

/**
 * 切换到指定标签页
 * @param {string} tabName - 标签页名称 ('translate' 或 'summary')
 */
function switchToTab(tabName) {
  // 切换按钮状态
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 切换内容
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === tabName) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

/**
 * 检查并执行待处理的动作
 */
let isCheckingAction = false; // 执行锁，防止重复执行

async function checkPendingAction() {
  // 如果正在执行，跳过
  if (isCheckingAction) {
    console.log('[Sidebar] 动作检查正在进行中，跳过');
    return;
  }

  isCheckingAction = true;
  console.log('[Sidebar] 开始检查待处理动作');

  try {
    const result = await chrome.storage.local.get('pendingAction');
    const action = result.pendingAction;

    if (!action) {
      console.log('[Sidebar] 没有待处理的动作');
      isCheckingAction = false;
      return;
    }

    console.log('[Sidebar] 发现待处理动作:', action);

    // 检查动作是否过期（30秒内有效，给用户足够时间）
    const now = Date.now();
    if (now - action.timestamp > 30000) {
      console.log('[Sidebar] 动作已过期');
      await chrome.storage.local.remove('pendingAction');
      isCheckingAction = false;
      return;
    }

    // 清除待处理的动作
    await chrome.storage.local.remove('pendingAction');

    console.log('[Sidebar] 执行待处理动作:', action.type);

    // 执行相应的动作
    switch (action.type) {
      case 'translateSelection':
        console.log('[Sidebar] 开始翻译选中文本:', action.text);
        // 切换到翻译标签页
        switchToTab('translate');
        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 100));
        // 自动执行翻译选中文本
        await translateSelectionText(action.text);
        break;

      case 'summarizePage':
        console.log('[Sidebar] 开始总结页面');
        // 切换到总结标签页
        switchToTab('summary');
        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 100));
        // 自动执行总结
        document.getElementById('summarizePage').click();
        break;
    }
  } catch (error) {
    console.error('[Sidebar] 执行待处理动作失败:', error);
  } finally {
    isCheckingAction = false;
  }
}

/**
 * 翻译选中的文本（从右键菜单触发）
 * @param {string} text - 选中的文本
 */
async function translateSelectionText(text) {
  const targetLang = document.getElementById('targetLang').value;
  const statusEl = document.getElementById('translateStatus');
  const resultEl = document.getElementById('translateResult');

  statusEl.textContent = '正在翻译选中文本...';
  statusEl.className = 'status loading';
  clearResult(resultEl);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 发送到 background 进行翻译
    const translateResponse = await chrome.runtime.sendMessage({
      action: 'translate',
      text: text,
      targetLang: targetLang,
      sourceUrl: tab.url
    });

    if (!translateResponse.success) {
      throw new Error(translateResponse.error || '翻译失败');
    }

    statusEl.textContent = '翻译完成';
    statusEl.className = 'status success';
    displayResult(resultEl, translateResponse.result, false);

  } catch (error) {
    statusEl.textContent = '错误: ' + error.message;
    statusEl.className = 'status error';
    console.error('Translation error:', error);
  }
}

// 页面加载时检查待处理的动作
console.log('[Sidebar] 页面加载完成，检查待处理动作');
checkPendingAction();

// 监听窗口获得焦点时，检查待处理的动作（处理侧边栏已打开的情况）
window.addEventListener('focus', () => {
  console.log('[Sidebar] 窗口获得焦点，检查待处理动作');
  checkPendingAction();
});

// 监听页面可见性变化，当侧边栏重新可见时检查待处理的动作
document.addEventListener('visibilitychange', () => {
  console.log('[Sidebar] 页面可见性变化:', document.visibilityState);
  if (document.visibilityState === 'visible') {
    checkPendingAction();
  }
});

/**
 * 显示结果（支持 Markdown 渲染）
 * @param {HTMLElement} element - 结果显示元素
 * @param {string} content - 内容
 * @param {boolean} useMarkdown - 是否使用 Markdown 渲染
 */
function displayResult(element, content, useMarkdown = false) {
  if (useMarkdown && typeof renderMarkdownContent === 'function') {
    element.innerHTML = renderMarkdownContent(content);
  } else {
    element.textContent = content;
  }
}

/**
 * 清空结果显示
 * @param {HTMLElement} element - 结果显示元素
 */
function clearResult(element) {
  element.innerHTML = '';
}

/**
 * 确保 content script 已加载
 * @param {number} tabId - 标签页 ID
 * @returns {Promise<boolean>} 是否成功加载
 */
async function ensureContentScript(tabId) {
  try {
    // 尝试发送 ping 消息测试 content script 是否存在
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch (error) {
    // Content script 不存在，尝试注入
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content/content.js']
      });
      // 等待一小段时间让 content script 初始化
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (injectError) {
      console.error('无法注入 content script:', injectError);
      return false;
    }
  }
}

/**
 * 安全地发送消息到 content script
 * @param {number} tabId - 标签页 ID
 * @param {object} message - 消息对象
 * @returns {Promise<object>} 响应对象
 */
async function sendMessageToTab(tabId, message) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    return response;
  } catch (error) {
    // 如果连接失败，尝试注入 content script 后重试
    console.log('Content script 未加载，尝试注入...');
    const injected = await ensureContentScript(tabId);

    if (injected) {
      // 重试发送消息
      return await chrome.tabs.sendMessage(tabId, message);
    } else {
      throw new Error('无法连接到页面。此页面可能不支持内容脚本（如 chrome:// 页面）');
    }
  }
}


// 翻译选中文本
document.getElementById('translateSelection').addEventListener('click', async () => {
  const targetLang = document.getElementById('targetLang').value;
  const statusEl = document.getElementById('translateStatus');
  const resultEl = document.getElementById('translateResult');

  statusEl.textContent = '正在获取选中文本...';
  statusEl.className = 'status loading';
  clearResult(resultEl);

  try {
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 使用安全的消息发送函数
    const response = await sendMessageToTab(tab.id, {
      action: 'getSelectedText'
    });

    if (!response.success || !response.text) {
      throw new Error('请先选中要翻译的文本');
    }

    statusEl.textContent = '正在翻译...';

    // 发送到 background 进行翻译
    const translateResponse = await chrome.runtime.sendMessage({
      action: 'translate',
      text: response.text,
      targetLang: targetLang,
      sourceUrl: tab.url
    });

    if (!translateResponse.success) {
      throw new Error(translateResponse.error || '翻译失败');
    }

    statusEl.textContent = '翻译完成';
    statusEl.className = 'status success';
    // 翻译结果使用纯文本显示
    displayResult(resultEl, translateResponse.result, false);

  } catch (error) {
    statusEl.textContent = '错误: ' + error.message;
    statusEl.className = 'status error';
    console.error('Translation error:', error);
  }
});

// 总结页面
document.getElementById('summarizePage').addEventListener('click', async () => {
  const summaryLength = document.getElementById('summaryLength').value;
  const statusEl = document.getElementById('summaryStatus');
  const resultEl = document.getElementById('summaryResult');

  statusEl.textContent = '正在提取页面内容...';
  statusEl.className = 'status loading';
  clearResult(resultEl);

  try {
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 使用安全的消息发送函数
    const response = await sendMessageToTab(tab.id, {
      action: 'getPageContent'
    });

    if (!response.success) {
      throw new Error(response.error || '无法获取页面内容');
    }

    statusEl.textContent = '正在生成总结...';

    // 发送到 background 进行总结
    const summaryResponse = await chrome.runtime.sendMessage({
      action: 'summarize',
      text: response.content,
      length: summaryLength,
      sourceUrl: tab.url,
      pageTitle: response.title
    });

    if (!summaryResponse.success) {
      throw new Error(summaryResponse.error || '总结失败');
    }

    statusEl.textContent = '总结完成';
    statusEl.className = 'status success';
    // 总结结果使用 Markdown 渲染
    displayResult(resultEl, summaryResponse.result, true);

  } catch (error) {
    statusEl.textContent = '错误: ' + error.message;
    statusEl.className = 'status error';
    console.error('Summary error:', error);
  }
});

// 打开设置页面
document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
