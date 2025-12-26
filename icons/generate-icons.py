#!/usr/bin/env python3
"""
图标生成脚本 - 使用 Python PIL
创建简单的占位图标用于测试
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("错误: 未找到 Pillow 库")
    print("请安装: pip install Pillow")
    print("或使用在线工具生成图标")
    exit(1)

import os

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("正在生成占位图标...")

# 图标尺寸
sizes = [16, 32, 48, 128]

# 颜色配置
bg_color = (25, 118, 210)  # #1976d2 蓝色
text_color = (255, 255, 255)  # 白色

for size in sizes:
    # 创建图像
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)

    # 绘制文字 "AI"
    text = "AI"
    font_size = size // 2

    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # 如果找不到字体，使用默认字体
        font = ImageFont.load_default()

    # 获取文字边界框
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 计算居中位置
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]

    # 绘制文字
    draw.text((x, y), text, fill=text_color, font=font)

    # 保存图标
    filename = f"icon{size}.png"
    img.save(filename)
    print(f"✓ 已生成 {filename}")

print("\n✓ 所有图标生成完成！")
