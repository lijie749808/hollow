# Hollow Knight Save Editor - 空洞骑士存档编辑器

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 简介

这是一款专业的 **Hollow Knight save editor** 在线工具，用于编辑和修改空洞骑士（Hollow Knight）游戏的存档文件。该工具完全免费，无需下载安装，直接在浏览器中使用。

### 主要功能

- 🎮 **多平台支持**：支持 PC（Steam/GOG）和 Nintendo Switch 版本的存档文件
- 🔒 **加密解密**：自动处理 PC 版本的加密存档文件
- ✏️ **可视化编辑**：将存档文件转换为可读的 JSON 格式进行编辑
- 💾 **历史记录**：自动保存最近编辑的文件，方便快速访问
- 📱 **响应式设计**：完美支持桌面和移动设备
- 🚀 **性能优化**：基于 Next.js 15+ 构建，加载速度快
- 🔍 **SEO 优化**：关键词 "hollow knight save editor" 密度控制在 3-5%

## 使用方法

### 在线使用

1. 访问网站
2. 备份你的原始存档文件（重要！）
3. 点击"选择文件"按钮或直接拖拽存档文件到页面
4. 编辑 JSON 数据（使用 Ctrl+F 或 Cmd+F 搜索特定字段）
5. 点击下载按钮获取修改后的存档文件

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 技术栈

- **框架**: Next.js 16.0
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **加密**: AES-JS（ECB 模式）
- **状态管理**: React Hooks

## 项目结构

```
hollow/
├── app/
│   ├── layout.tsx       # 根布局，包含 SEO 元数据
│   ├── page.tsx         # 主页面组件
│   └── globals.css      # 全局样式
├── lib/
│   ├── base64.ts        # Base64 编码/解码
│   ├── crypto.ts        # AES 加密/解密核心功能
│   └── useHistory.ts    # 历史记录管理 Hook
└── public/              # 静态资源
```

## 存档文件位置

### Windows (Steam)
```
C:\Users\[用户名]\AppData\LocalLow\Team Cherry\Hollow Knight\
```

### macOS (Steam)
```
~/Library/Application Support/unity.Team Cherry.Hollow Knight/
```

### Linux (Steam)
```
~/.config/unity3d/Team Cherry/Hollow Knight/
```

### Nintendo Switch
需要使用第三方工具导出存档文件。

## 常见修改项

- `geo`: 金币数量
- `maxHealth`: 最大生命值
- `health`: 当前生命值
- `MPReserveMax`: 最大灵魂容量
- `charms`: 护符解锁状态
- `charmsOwned`: 已拥有的护符
- `scenesEncounteredBench`: 已发现的长椅
- `scenesVisited`: 已访问的场景

## 安全提示

⚠️ **重要提醒**：

1. 在修改存档前，务必备份原始文件
2. 不当的修改可能导致存档损坏或游戏崩溃
3. 历史记录功能不能替代手动备份
4. 建议在测试存档上先行尝试

## SEO 关键词

本项目针对以下关键词进行了优化：
- hollow knight save editor
- 空洞骑士存档编辑器
- hollow knight 存档修改
- 空洞骑士修改器
- hollow knight save modifier

关键词密度控制在 3-5%，确保良好的搜索引擎优化效果。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- 原始加密/解密逻辑来自 [@KayDeeTee](https://github.com/KayDeeTee) 的 [Hollow Knight Save Manager](https://github.com/KayDeeTee/Hollow-Knight-SaveManager)
- 原始项目: [Hollow by bloodorca](https://github.com/bloodorca/hollow)

## 许可证

MIT License

---

**免责声明**：本工具仅供学习和个人使用。请遵守游戏开发商的用户协议。
