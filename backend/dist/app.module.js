"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const health_controller_1 = require("./health.controller");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const database_module_1 = require("./database/database.module");
const notification_module_1 = require("./notification/notification.module");
const mine_module_1 = require("./gameplay/mine/mine.module");
const item_module_1 = require("./item/item.module");
const plunder_module_1 = require("./gameplay/plunder/plunder.module");
const exchange_module_1 = require("./exchange/exchange.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
            mine_module_1.MineModule,
            item_module_1.ItemModule,
            plunder_module_1.PlunderModule,
            exchange_module_1.ExchangeModule,
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map