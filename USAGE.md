# Hollow Knight Save Editor 使用指南

## 目录

1. [快速开始](#快速开始)
2. [存档文件位置](#存档文件位置)
3. [常用修改项](#常用修改项)
4. [高级修改](#高级修改)
5. [常见问题](#常见问题)

## 快速开始

### 第一步：备份存档

在修改任何存档之前，**务必备份原始文件**！

1. 找到你的存档文件（参见下方"存档文件位置"）
2. 复制整个文件夹或至少复制 `user1.dat` 文件
3. 将备份保存到安全位置

### 第二步：上传存档

1. 访问 Hollow Knight Save Editor
2. 如果是 Switch 版本，勾选"Nintendo Switch 模式"
3. 点击"选择文件"按钮，或直接拖拽存档文件到页面
4. 等待文件加载和解密

### 第三步：编辑存档

1. 在文本编辑器中，你会看到格式化的 JSON 数据
2. 使用 `Ctrl+F`（Windows/Linux）或 `Cmd+F`（Mac）搜索你想修改的字段
3. 修改数值或布尔值
4. 确保保持 JSON 格式正确（注意逗号、引号等）

### 第四步：下载修改后的存档

1. 点击对应的下载按钮：
   - "下载加密文件 (PC)"：用于 Steam/GOG 等 PC 版本
   - "下载纯文本 (Switch)"：用于 Nintendo Switch 版本
2. 将下载的文件重命名为原始文件名（通常是 `user1.dat`）
3. 替换游戏存档文件夹中的原文件

## 存档文件位置

### Windows

#### Steam
```
C:\Users\[你的用户名]\AppData\LocalLow\Team Cherry\Hollow Knight\
```

#### GOG
```
C:\Users\[你的用户名]\AppData\LocalLow\Team Cherry\Hollow Knight\
```

**查找技巧**：
- 按 `Win + R` 打开运行对话框
- 输入 `%userprofile%\AppData\LocalLow\Team Cherry\Hollow Knight`
- 按回车键

### macOS

#### Steam
```
~/Library/Application Support/unity.Team Cherry.Hollow Knight/
```

**查找技巧**：
- 在 Finder 中按 `Cmd + Shift + G`
- 粘贴上述路径
- 按回车键

### Linux

#### Steam
```
~/.config/unity3d/Team Cherry/Hollow Knight/
```

或

```
~/.local/share/Steam/steamapps/compatdata/367520/pfx/drive_c/users/steamuser/AppData/LocalLow/Team Cherry/Hollow Knight/
```

### Nintendo Switch

Switch 版本需要：
1. 已破解的 Switch 主机
2. 使用 Checkpoint 或类似工具导出存档
3. 编辑后再导入回 Switch

## 常用修改项

### 基础属性

| 字段 | 说明 | 类型 | 示例值 |
|------|------|------|--------|
| `geo` | 金币数量 | 整数 | `9999` |
| `health` | 当前生命值 | 整数 | `9` |
| `maxHealth` | 最大生命值 | 整数 | `9` |
| `maxHealthBase` | 基础最大生命值 | 整数 | `5` |
| `MPCharge` | 当前灵魂 | 整数 | `99` |
| `MPReserve` | 储存灵魂 | 整数 | `99` |
| `MPReserveMax` | 最大储存灵魂 | 整数 | `99` |

### 护符相关

```json
"charmsOwned": true,  // 是否拥有该护符
"newCharmNum": 40,    // 护符总数
"charmSlots": 11,     // 护符槽位数
"charmSlotsFilled": 0, // 已使用的槽位
```

常见护符：
- `gotCharm_1` 到 `gotCharm_40`：各个护符的拥有状态

### 技能和能力

| 字段 | 说明 |
|------|------|
| `hasDash` | 冲刺能力 |
| `hasWallJump` | 爬墙能力 |
| `hasDoubleJump` | 二段跳 |
| `hasShadowDash` | 暗影冲刺 |
| `hasAcidArmour` | 抗酸装甲 |
| `hasDreamNail` | 梦之钉 |
| `hasDreamGate` | 梦之门 |
| `hasKingsBrand` | 国王烙印 |

### 法术

| 字段 | 说明 |
|------|------|
| `fireballLevel` | 复仇之魂等级（0-2） |
| `quakeLevel` | 深渊尖啸等级（0-2） |
| `screamLevel` | 哀嚎怨灵等级（0-2） |

### 钉子升级

```json
"nailSmithUpgrades": 4  // 钉子升级等级（0-4）
// 0 = 原始钉子
// 1 = 淬火钉子
// 2 = 锐利钉子
// 3 = 精炼钉子
// 4 = 纯粹钉子
```

## 高级修改

### 地图和区域

```json
"hasMap": true,              // 是否有地图
"mapAllRooms": true,         // 显示所有房间
"scenesVisited": ["..."],    // 已访问的场景列表
```

### Boss 击败状态

搜索相关 boss 名称，将其击败状态设为 `true`：
- `killedHollowKnight`: 空洞骑士
- `killedFinalBoss`: 辐光
- `killedGrimm`: 格林
- `killedNightmareGrimm`: 梦魇格林
- `killedHiveKnight`: 蜂巢骑士

### 完成度

```json
"completionPercentage": 112.0  // 完成百分比
```

注意：这个值需要与你实际完成的内容相匹配，否则可能导致不一致。

### 梦境之钉精华

```json
"dreamOrbs": 2400,  // 当前精华数量
```

## 常见问题

### Q: 修改后游戏崩溃或无法加载？

**A**: 可能的原因：
1. JSON 格式错误（缺少逗号、引号不匹配等）
2. 修改了不应该修改的字段
3. 数值超出合理范围

**解决方案**：
- 恢复备份文件
- 使用在线 JSON 验证器检查格式
- 逐步修改，每次只改少量内容

### Q: 为什么某些修改没有生效？

**A**: 某些字段之间有依赖关系。例如：
- 修改护符数量后，需要同时修改相关的布尔值
- 某些成就需要特定的前置条件

### Q: Switch 版本如何使用？

**A**: 
1. 需要已破解的 Switch 主机
2. 使用 Checkpoint 等工具导出存档
3. 勾选"Nintendo Switch 模式"
4. 编辑后下载纯文本版本
5. 使用 Checkpoint 导入回 Switch

### Q: 会被检测到作弊吗？

**A**: 
- 空洞骑士是单机游戏，没有反作弊系统
- 但修改存档可能影响游戏体验
- 建议在通关后使用，或创建专门的测试存档

### Q: 历史记录安全吗？

**A**: 
- 历史记录保存在浏览器的 localStorage 中
- 清除浏览器数据会删除历史记录
- **历史记录不能替代手动备份**

### Q: 可以在移动设备上使用吗？

**A**: 
- 可以，网站支持移动设备访问
- 但建议在电脑上操作，编辑更方便
- 移动设备需要文件管理器支持

## 注意事项

⚠️ **重要提醒**：

1. **始终备份**：在任何修改前备份原始文件
2. **JSON 格式**：确保 JSON 格式正确，否则会导致加载失败
3. **合理数值**：避免设置过大或过小的数值
4. **游戏版本**：不同游戏版本的存档格式可能略有不同
5. **成就系统**：某些修改可能影响成就解锁

## 技巧和建议

1. **使用搜索**：JSON 文件很大，使用 Ctrl+F 搜索关键字
2. **小步修改**：每次只修改少量内容，测试后再继续
3. **记录修改**：记下你修改了哪些内容，便于排查问题
4. **创建测试存档**：在 user2.dat 或 user3.dat 上测试
5. **参考文档**：查阅空洞骑士 Wiki 了解各字段含义

## 相关资源

- [Hollow Knight Wiki](https://hollowknight.fandom.com/)
- [官方 Discord](https://discord.gg/hollowknight)
- [Reddit 社区](https://www.reddit.com/r/HollowKnight/)

---

如有问题或建议，欢迎在 GitHub 上提交 Issue！

