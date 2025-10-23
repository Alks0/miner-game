# miner-game

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

