#!/bin/bash

# Chrome 扩展打包脚本
# 生成 .crx 文件

set -e

EXTENSION_DIR="/root/code/summarize/browser-extension"
OUTPUT_DIR="/root/code/summarize"
EXTENSION_NAME="ai-translate-summarize"

echo "🔨 开始打包 Chrome 扩展..."

# 检查 Chrome 是否安装
if ! command -v google-chrome &> /dev/null && ! command -v chromium &> /dev/null; then
    echo "❌ 错误：未找到 Chrome 或 Chromium 浏览器"
    echo "请使用 Chrome 浏览器手动打包："
    echo "1. 访问 chrome://extensions/"
    echo "2. 启用开发者模式"
    echo "3. 点击'打包扩展程序'"
    echo "4. 选择目录: $EXTENSION_DIR"
    exit 1
fi

# 检查是否存在私钥文件
PEM_FILE="${OUTPUT_DIR}/${EXTENSION_NAME}.pem"

# 使用 Chrome 命令行打包
if [ -f "$PEM_FILE" ]; then
    echo "📦 使用现有私钥打包..."
    google-chrome --pack-extension="$EXTENSION_DIR" --pack-extension-key="$PEM_FILE" 2>/dev/null || \
    chromium --pack-extension="$EXTENSION_DIR" --pack-extension-key="$PEM_FILE" 2>/dev/null
else
    echo "📦 首次打包，生成新私钥..."
    google-chrome --pack-extension="$EXTENSION_DIR" 2>/dev/null || \
    chromium --pack-extension="$EXTENSION_DIR" 2>/dev/null

    # 移动生成的 .pem 文件
    if [ -f "${EXTENSION_DIR}.pem" ]; then
        mv "${EXTENSION_DIR}.pem" "$PEM_FILE"
        echo "✅ 私钥已保存: $PEM_FILE"
        echo "⚠️  请妥善保管此文件，用于后续更新！"
    fi
fi

# 移动生成的 .crx 文件
if [ -f "${EXTENSION_DIR}.crx" ]; then
    CRX_FILE="${OUTPUT_DIR}/${EXTENSION_NAME}.crx"
    mv "${EXTENSION_DIR}.crx" "$CRX_FILE"
    echo "✅ 扩展包已生成: $CRX_FILE"

    # 显示文件信息
    ls -lh "$CRX_FILE"
else
    echo "❌ 打包失败，未生成 .crx 文件"
    exit 1
fi

echo ""
echo "🎉 打包完成！"
echo ""
echo "📁 输出文件："
echo "   - CRX: $CRX_FILE"
echo "   - PEM: $PEM_FILE"
echo ""
echo "💡 使用方法："
echo "   1. 将 .crx 文件发送给用户"
echo "   2. 用户拖拽到 chrome://extensions/ 页面安装"
echo "   3. 或者发布到 Chrome Web Store"
