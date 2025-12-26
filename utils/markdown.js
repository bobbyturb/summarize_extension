/**
 * Markdown 渲染器
 * 将常见的 Markdown 语法转换为 HTML
 * 用于显示 AI 返回的格式化内容
 */

/**
 * 转义 HTML 特殊字符（防止 XSS）
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 渲染 Markdown 为 HTML
 */
function renderMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // 1. 处理代码块（```）- 必须先处理，避免内容被其他规则影响
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(`<pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`);
    return placeholder;
  });

  // 2. 处理行内代码（`code`）
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // 3. 处理标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 4. 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 5. 处理粗体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // 6. 处理斜体
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // 7. 处理分隔线
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');

  // 8. 处理列表
  html = processLists(html);

  // 9. 处理段落
  html = processParagraphs(html);

  // 10. 恢复代码块和行内代码
  codeBlocks.forEach((code, i) => {
    html = html.replace(`___CODE_BLOCK_${i}___`, code);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`___INLINE_CODE_${i}___`, code);
  });

  return html;
}

/**
 * 处理列表
 */
function processLists(html) {
  const lines = html.split('\n');
  const result = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 无序列表
    if (/^[-*+]\s+(.+)/.test(trimmed)) {
      const content = trimmed.replace(/^[-*+]\s+/, '');
      if (!inUnorderedList) {
        result.push('<ul>');
        inUnorderedList = true;
      }
      result.push(`<li>${content}</li>`);
    }
    // 有序列表
    else if (/^(\d+)\.\s+(.+)/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.+)/);
      const number = match[1];
      const content = match[2];

      if (!inOrderedList) {
        if (inUnorderedList) {
          result.push('</ul>');
          inUnorderedList = false;
        }
        result.push('<ol>');
        inOrderedList = true;
      }
      // 保留原始编号
      result.push(`<li value="${number}">${content}</li>`);
    }
    // 其他行
    else {
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      result.push(line);
    }
  }

  // 关闭未闭合的列表
  if (inUnorderedList) result.push('</ul>');
  if (inOrderedList) result.push('</ol>');

  return result.join('\n');
}

/**
 * 处理段落
 */
function processParagraphs(html) {
  // 分割成块
  const blocks = html.split(/\n\n+/);
  const processed = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // 跳过已经是 HTML 标签的内容
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<blockquote')
    ) {
      processed.push(trimmed);
    } else {
      // 包裹在 <p> 标签中
      processed.push(`<p>${trimmed.replace(/\n/g, '<br>')}</p>`);
    }
  }

  return processed.join('\n');
}

/**
 * 主渲染函数
 */
function renderMarkdownContent(text) {
  if (!text) return '';
  return renderMarkdown(text);
}

// 确保在全局作用域中可用
if (typeof window !== 'undefined') {
  window.renderMarkdownContent = renderMarkdownContent;
  window.renderMarkdown = renderMarkdown;
}

