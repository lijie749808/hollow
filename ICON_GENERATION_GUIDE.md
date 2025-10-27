# 图标生成指南

## 🎨 快速生成所有图标

我已经为您创建了一个简单的图标生成器，可以在浏览器中直接生成所有需要的图标。

### 使用方法

1. **打开图标生成器**
   ```bash
   # 在项目根目录下，用浏览器打开
   open generate-icons.html
   # 或者双击 generate-icons.html 文件
   ```

2. **自动生成**
   - 页面加载后会自动生成所有图标
   - 或者点击 "Generate All Icons" 按钮

3. **下载图标**
   点击以下按钮下载每个图标：
   - ⬇️ Download favicon.ico
   - ⬇️ Download icon-192.png
   - ⬇️ Download icon-512.png
   - ⬇️ Download apple-icon.png
   - ⬇️ Download og-image.png

4. **放置图标**
   将所有下载的文件放到 `/public` 文件夹中：
   ```
   /public/
   ├── favicon.ico
   ├── icon-192.png
   ├── icon-512.png
   ├── apple-icon.png
   └── og-image.png
   ```

5. **完成！** 🎉
   部署后所有图标会自动生效！

## 📋 生成的图标说明

### 1. favicon.ico (32x32)
- 浏览器标签页图标
- 自动在所有浏览器中显示

### 2. icon-192.png (192x192)
- PWA 应用图标
- 用于移动设备添加到主屏幕

### 3. icon-512.png (512x512)
- PWA 高分辨率图标
- 用于大尺寸显示场景

### 4. apple-icon.png (180x180)
- Apple Touch Icon
- iOS 设备添加到主屏幕时使用

### 5. og-image.png (1200x630)
- Open Graph 图片
- 社交媒体分享时显示的预览图
- 包含网站标题和介绍

## 🎨 图标设计说明

生成的图标具有以下特点：
- **紫粉渐变主题** - 与网站设计一致
- **HK 字母标识** - 代表 Hollow Knight
- **现代简洁** - 清晰易识别
- **多尺寸优化** - 每个尺寸都有适配的设计

## 🔄 自定义图标

如果您想自定义图标设计：

1. 编辑 `generate-icons.html` 文件
2. 修改以下内容：
   - 颜色渐变 (gradient.addColorStop)
   - 文字内容 ('HK')
   - 字体大小 (fontSize)
   - 背景效果

3. 刷新页面重新生成

## ⚡ 一键操作

```bash
# 1. 打开生成器
open generate-icons.html

# 2. 等待自动生成（或点击按钮）

# 3. 点击所有下载按钮

# 4. 移动文件到 public 文件夹
mv ~/Downloads/favicon.ico public/
mv ~/Downloads/icon-192.png public/
mv ~/Downloads/icon-512.png public/
mv ~/Downloads/apple-icon.png public/
mv ~/Downloads/og-image.png public/
```

## ✅ 验证图标

部署后验证：
- 浏览器标签页显示图标
- https://realfavicongenerator.net/ 测试
- Twitter Card Validator
- Facebook Sharing Debugger

---

**注意**: 图标文件已经在 `app/layout.tsx` 和 `public/manifest.json` 中配置好，放入 public 文件夹后会自动工作！

