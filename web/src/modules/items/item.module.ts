import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogModule } from "../log/logs.module.js";
import { LogsService } from "../log/logs.service.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { ItemsController } from "./item.controller.js";
import { Item } from "./item.entity.js";
import { ItemsService } from "./item.service.js";

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [TypeOrmModule.forFeature([Item]), LogModule, NotificationsModule]
})
export class ItemsModule {}