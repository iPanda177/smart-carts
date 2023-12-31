import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller.js";
import { CartService } from "./cart.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity.js";
import { Shop } from "../shops/shop.entity.js";
import { Item } from "../items/item.entity.js";
import { Customer } from "../customers/customer.entity.js";
import { CustomerModule } from "../customers/customer.module.js";
import { ShopModule } from "../shops/shop.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import {SynchronizeGateway} from "../../synchronize/synchronize.gateway.js";
import { Analytics } from "../analytics/analytics.entity.js";


@Module({
  controllers: [CartController],
  providers: [CartService, SynchronizeGateway],
  imports: [
    TypeOrmModule.forFeature([Cart, Shop, Item, Customer, Analytics]),
    CustomerModule,
    ShopModule,
    NotificationsModule,
  ],
  exports: [TypeOrmModule, CartService]
})
export class CartModule {}
