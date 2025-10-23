<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

## 环境变量

可在进程环境中提供以下变量（无 .env 文件时默认值亦可运行）：

- `PORT`（默认 `3000`）
- `JWT_SECRET`（默认 `dev_secret_change_me`，请在生产更换）
- `JWT_EXPIRES_IN`（单位：秒，默认 `604800` 即 7 天）

## 认证接口（最小可用示例）

- 注册：`POST /api/auth/register`

  请求体：
  ```json
  { "username": "user", "password": "password" }
  ```
  响应体示例：
  ```json
  { "access_token": "...", "user": {"id":"demo-user-id","username":"user"} }
  ```

- 登录：`POST /api/auth/login`

- 受保护资料：`GET /api/auth/profile`

  请求头：`Authorization: Bearer <access_token>`

  响应体示例：
  ```json
  { "userId": "demo-user-id", "username": "user" }
  ```

## 用户接口（内存版示例）

- 获取资料：`GET /api/user/profile` （需 Bearer Token）返回含资源：`{ id, username, nickname, oreAmount, bbCoins }`
- 修改昵称：`PATCH /api/user/nickname`，请求体：`{"nickname":"新昵称"}`（需 Bearer Token）

---

## 挖矿（内存版示例）

- 开始挖矿：`POST /api/mine/start`（需 Bearer Token）
- 停止挖矿：`POST /api/mine/stop`
- 查询矿车：`GET /api/mine/cart`
- 收矿：`POST /api/mine/collect`（收矿后计入用户 `oreAmount`）
- 状态查询：`GET /api/mine/status`（返回 `{ collapsed, collapsedRemaining }`）

### WebSocket 事件（命名空间 /game）
- 连接方式（示例）：
  ```js
  const socket = io("http://localhost:3000/game", { auth: { token: "<JWT>" } });
  socket.on('mine.update', (msg) => console.log(msg));
  socket.on('mine.collapse', (msg) => console.log(msg));
  ```
- 事件：
  - `mine.update`：`{ type: 'normal'|'critical', amount, cartAmount, cartCapacity }`
  - `mine.collapse`：`{ repair_duration: 120 }`

## 统一响应与错误格式

- 成功：
  ```json
  { "code": 200, "message": "success", "data": { /* 具体数据 */ } }
  ```
- 失败（示例）：
  ```json
  { "code": 400, "message": "Bad Request Exception", "error": "BadRequestException" }
  ```

---

## 数据库（可选）

- 通过环境变量开启数据库：`DB_ENABLE=1`
- PostgreSQL 默认配置：
  - `DB_HOST=localhost`
  - `DB_PORT=5432`
  - `DB_USERNAME=postgres`
  - `DB_PASSWORD=postgres`
  - `DB_NAME=mining_game`

### 迁移（TypeORM CLI）

- 生成迁移：
  ```bash
  npm run typeorm migration:generate src/database/migrations/Init -d src/data-source.ts
  ```
- 运行迁移：
  ```bash
  npm run typeorm migration:run -d src/data-source.ts
  ```
- 回滚迁移：
  ```bash
  npm run typeorm migration:revert -d src/data-source.ts
  ```

---

## 道具（内存版示例）

- 列出模板：`GET /api/items/templates`
- 列出我的道具：`GET /api/items`（首次会发基础矿机与矿车并默认装备）
- 装备：`POST /api/items/equip`，请求体：`{"itemId":"..."}`
- 升级：`POST /api/items/upgrade`，请求体：`{"itemId":"..."}`

### 挖矿加成规则（当前内存版）
- 矿机等级：每升 1 级，产出间隔缩短 100ms（最小 1s）
- 矿车等级：每升 1 级，容量 +500（基础 1000）