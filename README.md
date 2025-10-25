# 🎮 Miner Game - 矿工游戏

一个基于 Web 的多人在线挖矿游戏，包含挖矿、掠夺、交易、排行榜等核心玩法。

## 📋 项目简介

这是一个全栈 Web 游戏项目，玩家可以通过挖矿获取资源，与其他玩家进行掠夺战斗，在交易所兑换资源，并通过排行榜竞争。游戏采用实时通信技术，提供流畅的游戏体验。

## ✨ 核心功能

### 🔐 用户系统
- 用户注册与登录
- JWT 身份认证
- 昵称修改
- 用户资料管理

### ⛏️ 挖矿系统
- 开始/停止挖矿
- 实时矿车进度更新
- 收集矿石
- 矿洞崩塌机制

### ⚔️ 掠夺系统
- 玩家间资源掠夺
- 实时战斗通知
- 防御机制

### 💱 交易所
- 矿石兑换 BB 币
- 实时汇率系统

### 📦 仓库系统
- 物品管理
- 碎片合成

### 🏆 排行榜
- 全服玩家排名
- 多维度排序

### 📢 实时通知
- WebSocket 实时推送
- 游戏事件通知
- 掠夺提醒

### 🎁 广告系统
- 观看广告获得奖励

## 🛠️ 技术栈

### 后端
- **框架**: NestJS 11.x
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT + Passport
- **实时通信**: Socket.IO
- **语言**: TypeScript

### 前端
- **语言**: TypeScript
- **构建工具**: esbuild
- **实时通信**: Socket.IO Client
- **架构**: 模块化组件系统

## 📦 项目结构

```
miner-game/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── user/           # 用户模块
│   │   ├── gameplay/       # 游戏玩法模块
│   │   │   ├── mine/       # 挖矿系统
│   │   │   └── plunder/    # 掠夺系统
│   │   ├── exchange/       # 交易所模块
│   │   ├── item/           # 道具系统
│   │   ├── ranking/        # 排行榜模块
│   │   ├── notification/   # 实时通知
│   │   ├── database/       # 数据库配置
│   │   └── shared/         # 共享工具
│   └── package.json
├── frontend-scripts/        # 前端业务逻辑
│   ├── components/         # UI 组件
│   ├── scenes/             # 游戏场景
│   ├── core/               # 核心管理器
│   └── utils/              # 工具函数
├── web/                    # 前端静态资源
│   ├── index.html
│   └── app.js              # 打包后的 JS
├── dev-server.js           # 开发服务器
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 9.x

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd miner-game
```

2. **配置数据库**

创建 PostgreSQL 数据库：
```sql
CREATE DATABASE miner_game;
```

3. **配置环境变量**

在 `backend` 目录下创建 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=miner_game

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here

# 服务端口
PORT=3002
```

4. **启动开发服务器**

使用一键启动脚本：
```bash
npm run dev
```

这将自动完成以下操作：
- 安装后端依赖
- 启动 NestJS 后端服务 (端口 3002)
- 实时编译前端 TypeScript 代码
- 启动前端开发服务器 (端口 5173)
- 配置 API 代理

5. **访问游戏**

打开浏览器访问：`http://localhost:5173`

## 🎮 游戏玩法

### 1. 注册/登录
- 输入用户名和密码
- 系统自动注册或登录

### 2. 开始挖矿
- 点击"开始挖矿"按钮
- 矿车自动填充矿石
- 达到一定容量后点击"收矿"

### 3. 交易资源
- 在交易所将矿石兑换为 BB 币
- 实时汇率浮动

### 4. 掠夺其他玩家
- 选择目标玩家
- 发起掠夺攻击
- 获取对方的资源

### 5. 查看排行榜
- 查看全服玩家排名
- 竞争更高排名

## 📡 API 文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户接口
- `GET /api/user/profile` - 获取用户信息
- `PATCH /api/user/nickname` - 修改昵称

### 挖矿接口
- `POST /api/mine/start` - 开始挖矿
- `POST /api/mine/stop` - 停止挖矿
- `POST /api/mine/collect` - 收集矿石
- `GET /api/mine/cart` - 获取矿车状态

### 掠夺接口
- `POST /api/plunder/attack` - 发起掠夺
- `GET /api/plunder/targets` - 获取可掠夺目标

### 交易所接口
- `POST /api/exchange/ore-to-coin` - 矿石兑换 BB 币
- `GET /api/exchange/rate` - 获取当前汇率

### 排行榜接口
- `GET /api/ranking` - 获取排行榜

## 🔌 WebSocket 事件

连接地址：`ws://localhost:3002/game`

### 客户端监听事件
- `mine.update` - 挖矿进度更新
- `mine.collapse` - 矿洞崩塌
- `plunder.attacked` - 被掠夺通知

## 🔧 开发命令

### 根目录
```bash
npm run dev              # 启动开发服务器
npm run build:web        # 构建前端代码
```

### 后端目录 (backend/)
```bash
npm run start:dev        # 启动后端开发服务器
npm run start:prod       # 生产模式启动
npm run build            # 构建后端
npm run test             # 运行测试
npm run lint             # 代码检查
npm run format           # 代码格式化
```

## 📝 数据库迁移

```bash
cd backend
npm run typeorm migration:generate -- src/database/migrations/MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

## 🎨 前端架构

### 核心管理器
- **GameManager**: 游戏状态管理
- **NetworkManager**: 网络请求管理
- **RealtimeClient**: WebSocket 连接管理
- **ThemeManager**: 主题样式管理

### 场景系统
- **LoginScene**: 登录场景
- **MainScene**: 主界面场景
- **PlunderScene**: 掠夺场景
- **ExchangeScene**: 交易所场景
- **RankingScene**: 排行榜场景
- **WarehouseScene**: 仓库场景

### UI 组件
- 动画图标、浮动文字、进度条
- 资源卡片、挖矿卡片
- Toast 提示、广告弹窗

## 🔐 安全特性

- JWT Token 认证
- 密码 bcrypt 加密
- 请求参数验证
- 全局异常处理
- API 速率限制

## 🐛 调试

### 查看后端日志
后端日志会直接输出到控制台，标记为 `[backend]`

### 查看前端构建
前端构建日志会输出 esbuild 的编译状态

### 浏览器调试
打开浏览器开发者工具查看：
- 网络请求
- WebSocket 连接
- 控制台日志

## 📄 License

[MIT License](LICENSE)

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**Happy Mining! ⛏️💎**