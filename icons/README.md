# 图标文件说明

这个目录需要包含插件的图标文件。

## 需要的图标尺寸

- **icon16.png** - 16x16 像素 (浏览器工具栏)
- **icon32.png** - 32x32 像素 (Windows 电脑)
- **icon48.png** - 48x48 像素 (扩展管理页面)
- **icon128.png** - 128x128 像素 (Chrome Web Store 和安装时)

## 如何创建图标

### 方法1: 在线工具
使用以下在线工具生成不同尺寸的图标：
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://www.websiteplanet.com/webtools/favicon-generator/

### 方法2: 使用设计工具
- 使用 Figma, Sketch, Photoshop 等设计工具
- 创建一个正方形的图标设计
- 导出为 PNG 格式，分别保存为不同尺寸

### 方法3: 使用占位图标
快速测试时，可以使用简单的占位图标：

```bash
# 如果安装了 ImageMagick
convert -size 16x16 xc:blue icon16.png
convert -size 32x32 xc:blue icon32.png
convert -size 48x48 xc:blue icon48.png
convert -size 128x128 xc:blue icon128.png
```

### 方法4: 从现有图片生成
如果你有一张图片，可以使用 ImageMagick 转换：

```bash
convert your-image.png -resize 16x16 icon16.png
convert your-image.png -resize 32x32 icon32.png
convert your-image.png -resize 48x48 icon48.png
convert your-image.png -resize 128x128 icon128.png
```

## 设计建议

- 使用简洁的设计，在小尺寸下也能识别
- 使用高对比度的颜色
- 避免过多细节
- 可以使用与"AI"、"翻译"、"总结"相关的图标元素
- 建议使用透明背景（PNG格式）

## 注意事项

在加载插件前，请确保这个目录下有所有必需的图标文件，否则插件可能无法正常加载。
