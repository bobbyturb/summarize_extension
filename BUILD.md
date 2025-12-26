# 构建和打包指南

本文档介绍如何打包和发布 AI 翻译与总结助手浏览器扩展。

## 📦 打包方式

### 方式1：Chrome 浏览器打包（生成 .crx）

这是最简单直接的方式，适合个人使用或内部分发。

#### 步骤：

1. **打开 Chrome 扩展管理页面**
   ```
   chrome://extensions/
   ```

2. **启用开发者模式**
   - 点击页面右上角的"开发者模式"开关

3. **点击"打包扩展程序"**
   - 在页面顶部会出现"打包扩展程序"按钮

4. **配置打包选项**
   - **扩展根目录**: 选择 `browser-extension` 文件夹
   - **私有密钥文件**:
     - 首次打包留空
     - 更新时选择之前生成的 `.pem` 文件

5. **完成打包**
   - 点击"打包扩展程序"按钮
   - 会生成两个文件：
     - `browser-extension.crx` - 扩展安装包
     - `browser-extension.pem` - 私钥文件（**请妥善保管**）

#### 重要提示：

⚠️ **私钥文件（.pem）必须保管好！**
- 用于后续版本更新
- 丢失后无法更新已安装的扩展
- 建议备份到安全位置

### 方式2：创建 ZIP 文件（发布到 Chrome Web Store）

如果要发布到 Chrome Web Store，需要上传 .zip 文件。

#### 手动创建：

**Windows:**
1. 右键点击 `browser-extension` 文件夹
2. 选择"发送到" → "压缩(zipped)文件夹"
3. 重命名为 `ai-translate-summarize-v1.0.2.zip`

**macOS:**
1. 右键点击 `browser-extension` 文件夹
2. 选择"压缩"
3. 重命名为 `ai-translate-summarize-v1.0.2.zip`

**Linux:**
```bash
cd /root/code/summarize
zip -r ai-translate-summarize-v1.0.2.zip browser-extension \
  -x "browser-extension/.git/*" \
  -x "browser-extension/.*" \
  -x "browser-extension/*.sh"
```

或使用 tar：
```bash
cd /root/code/summarize
tar -czf ai-translate-summarize-v1.0.2.tar.gz \
  --exclude='.git' \
  --exclude='*.sh' \
  browser-extension/
```

## 🚀 发布到 Chrome Web Store

### 准备工作

1. **注册开发者账号**
   - 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - 支付一次性注册费用（5 美元）

2. **准备素材**
   - 应用图标（128x128）：`icons/icon128.png` ✅
   - 宣传图片：
     - 小型宣传图 (440x280)
     - 大型宣传图 (920x680) - 可选
     - 截图 (至少1张, 最多5张, 1280x800 或 640x400)

3. **准备描述文本**
   - 简短描述（132字符以内）
   - 详细描述（参考 README.md）
   - 隐私政策 URL（如果收集数据）

### 上传步骤

1. **登录开发者控制台**
   ```
   https://chrome.google.com/webstore/devconsole
   ```

2. **创建新应用**
   - 点击"新建项目"
   - 上传 ZIP 文件
   - 填写应用信息

3. **配置应用详情**
   - 名称：AI翻译与总结助手
   - 简短描述：使用AI自动翻译和总结网页内容
   - 详细描述：（参考 README.md）
   - 类别：工具/生产力
   - 语言：中文（简体）

4. **上传图片资源**
   - 小图标：128x128 ✅ 已有
   - 宣传图：需要制作
   - 截图：需要制作

5. **设置隐私设置**
   - 是否使用远程代码：否
   - 是否收集用户数据：是（API Key 存储在本地）
   - 隐私政策：需要提供

6. **提交审核**
   - 审核时间：1-3天
   - 通过后即可公开发布

## 📋 发布前检查清单

- [ ] manifest.json 版本号已更新
- [ ] 所有功能测试通过
- [ ] 图标文件完整（16/32/48/128）
- [ ] README.md 文档完整
- [ ] 准备好宣传截图
- [ ] 准备好隐私政策（如需要）
- [ ] ZIP 文件不包含 .git 等开发文件

## 🔄 版本更新

### 更新流程

1. **修改代码**
   - 更新功能或修复 bug

2. **更新版本号**
   - 编辑 `manifest.json`
   - 修改 `version` 字段（如 1.0.2 → 1.0.3）

3. **重新打包**
   - 使用相同的 .pem 文件打包
   - 或重新创建 ZIP 文件

4. **上传更新**
   - Chrome Web Store: 上传新的 ZIP
   - 直接分发: 分享新的 .crx 文件

## 💡 分发方式

### 1. Chrome Web Store（推荐）
- ✅ 自动更新
- ✅ 用户信任度高
- ✅ 易于搜索和发现
- ❌ 需要审核
- ❌ 需要支付注册费

### 2. 直接分发 .crx 文件
- ✅ 无需审核
- ✅ 完全控制
- ❌ 用户需要手动安装
- ❌ 需要手动更新
- ❌ Chrome 会显示"未验证"警告

### 3. 企业内部部署
- 使用组策略分发
- 需要配置扩展白名单

## 🛠️ 开发模式安装（测试用）

```
1. 访问 chrome://extensions/
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 browser-extension 文件夹
5. 完成安装
```

## 📝 版本历史

- **v1.0.2** (2025-12-26)
  - 初始发布版本
  - 支持翻译和总结功能
  - 支持多AI服务商
  - Markdown 格式化
  - 自定义总结 prompt

---

**需要帮助？**
- 查看 [README.md](README.md) 了解功能说明
- 查看 [DEBUG_GUIDE.md](DEBUG_GUIDE.md) 调试问题
- 提交 Issue 到 GitHub 仓库
