#!/bin/bash

# 图标生成脚本
# 使用 ImageMagick 创建简单的占位图标

echo "正在生成占位图标..."

# 检查 ImageMagick 是否安装
if ! command -v convert &> /dev/null; then
    echo "错误: 未找到 ImageMagick"
    echo "请安装 ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  或使用在线工具生成图标"
    exit 1
fi

# 创建蓝色渐变背景的图标，带有 AI 文字
cd "$(dirname "$0")"

# 创建不同尺寸的图标
for size in 16 32 48 128; do
    convert -size ${size}x${size} \
        -background "#1976d2" \
        -fill white \
        -gravity center \
        -pointsize $((size/3)) \
        label:"AI" \
        "icon${size}.png"

    echo "已生成 icon${size}.png"
done

echo "✓ 所有图标生成完成！"
