/**
 * Content Script - 运行在网页上下文中
 * 负责提取页面内容和处理用户选择
 */

// 监听来自 sidebar 或 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    // 用于检测 content script 是否已加载
    sendResponse({ success: true });
  } else if (request.action === 'getPageContent') {
    // 获取页面主要内容
    const content = extractPageContent();
    sendResponse({
      success: true,
      content: content,
      title: document.title
    });
  } else if (request.action === 'getSelectedText') {
    // 获取用户选中的文本
    const selectedText = window.getSelection().toString().trim();
    sendResponse({
      success: true,
      text: selectedText
    });
  }

  return true; // 保持消息通道开放
});

/**
 * 提取页面主要内容
 * 过滤掉导航栏、侧边栏、广告等无关内容
 */
function extractPageContent() {
  // 尝试使用 Readability 算法提取主要内容
  const article = extractArticleContent();
  if (article) {
    return article;
  }

  // 如果没有找到文章内容，提取body中的文本
  return extractBodyText();
}

/**
 * 提取文章内容（适用于博客、新闻等）
 */
function extractArticleContent() {
  // 常见的文章容器选择器
  const articleSelectors = [
    'article',
    '[role="article"]',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.content',
    'main',
    '[role="main"]',
    '#content',
    '.main-content'
  ];

  for (const selector of articleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return extractTextFromElement(element);
    }
  }

  return null;
}

/**
 * 提取body中的文本（回退方案）
 */
function extractBodyText() {
  // 要排除的元素
  const excludeSelectors = [
    'script',
    'style',
    'nav',
    'header',
    'footer',
    'aside',
    '[role="navigation"]',
    '[role="banner"]',
    '[role="complementary"]',
    '.sidebar',
    '.navigation',
    '.menu',
    '.ad',
    '.advertisement',
    '.social-share'
  ];

  const body = document.body.cloneNode(true);

  // 移除排除的元素
  excludeSelectors.forEach(selector => {
    const elements = body.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  return extractTextFromElement(body);
}

/**
 * 从DOM元素中提取文本
 */
function extractTextFromElement(element) {
  // 获取所有文本节点
  let text = '';

  // 处理段落
  const paragraphs = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
  if (paragraphs.length > 0) {
    paragraphs.forEach(p => {
      const pText = p.innerText.trim();
      if (pText) {
        text += pText + '\n\n';
      }
    });
  } else {
    // 如果没有段落，直接获取文本内容
    text = element.innerText;
  }

  // 清理文本
  text = text
    .replace(/\n{3,}/g, '\n\n')  // 移除多余的空行
    .replace(/\t+/g, ' ')         // 替换制表符
    .trim();

  return text;
}

/**
 * 右键菜单翻译选中文本（可选功能）
 */
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // 可以在这里添加一个小按钮，让用户快速翻译选中的文本
    // 或者等待右键菜单的实现
  }
});

console.log('AI翻译与总结助手 Content Script 已加载');
