# miner-game

> 运行原则：默认本地单机即可跑通（JWT + WebSocket + 内存存储）。数据库/Redis/队列均为可选，按需开启。

## 后端运行指南（NestJS）

### 目录结构

```
backend/
  src/
  package.json
```

### 安装与运行

1. 安装依赖

   ```bash
   cd backend
   npm install
   ```

2. 开发运行（热重载）

   ```bash
   npm run start:dev
   ```

3. 访问健康检查

   - 本地地址：`http://localhost:3000/api/health`
   - 响应示例：`{"status":"ok"}`

4. 生产构建与启动

   ```bash
   npm run build
   npm run start:prod
   ```

可选扩展
- 开启数据库：设置 `DB_ENABLE=1` 并参阅 `backend/README.md` 的迁移说明
- WebSocket 命名空间：`/game`（`mine.update`、`mine.collapse`、`plunder.attacked`）

## 前端运行（Cocos Creator 3.x，本地预览）

1) 在 Cocos 新建 2D/H5 项目，打开工程
2) 将 `frontend-scripts/` 下脚本拷入你的 `assets/scripts/`（或按需目录）
3) 在网页模板中引入 socket.io-client（如需 WS），或改用内置 WebSocket
4) 在浏览器控制台执行：
```js
MinerApp.bootstrap(document.body)
```
默认流程：登录/注册 → 进入主界面 → 开始挖矿 → 收矿 → 资源实时刷新。视觉风格为紫蓝渐变科技风（卡片+发光+涟漪）。

