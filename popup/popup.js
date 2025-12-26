/**
 * Popup Script - 快速操作入口
 */

// 打开侧边栏
document.getElementById('openSidebar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.sidePanel.open({ windowId: tab.windowId });
  window.close();
});

// 总结当前页面
document.getElementById('summarizePage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // 先打开侧边栏（保持在用户手势上下文中）
    chrome.sidePanel.open({ windowId: tab.windowId });

    // 然后保存待执行的动作（不等待，异步执行）
    chrome.storage.local.set({
      pendingAction: {
        type: 'summarizePage',
        timestamp: Date.now()
      }
    });

    window.close();
  });
});

// 打开设置
document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

// 打开帮助
document.getElementById('openHelp').addEventListener('click', () => {
  const helpUrl = 'https://github.com/your-repo/ai-assistant-extension';
  chrome.tabs.create({ url: helpUrl });
  window.close();
});

// 显示状态消息
function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
}

// 检查配置状态
async function checkConfiguration() {
  try {
    const settings = await chrome.storage.sync.get('aiProvider');
    if (!settings.aiProvider) {
      // 首次使用，显示提示
      showStatus('请先配置AI服务', 'error');
    }
  } catch (error) {
    console.error('Failed to check configuration:', error);
  }
}

// 页面加载时检查配置
checkConfiguration();
