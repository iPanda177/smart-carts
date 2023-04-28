import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { Analytics } from "../modules/analytics/analytics.entity.js";
import { Shop } from "../modules/shops/shop.entity.js";
import shopify from "../utils/shopify.js";

@Injectable()
export class getShopDataMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Shop) private shopsRepository: Repository<Shop>,
    @InjectRepository(Analytics) private analyticsRepository: Repository<Analytics>
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = res.locals.shopify.session;

    try {
      const [shopifyShopData] = await shopify.api.rest.Shop.all({ session });

      const shop = await this.shopsRepository.findOneBy({ shopify_id: shopifyShopData.id });

      const sessionJSON = await JSON.stringify(session);
      if (shop) {
        if (shop.session !== sessionJSON) {
          await this.shopsRepository.update({ shopify_id: shopifyShopData.id }, { session: sessionJSON });
        }

        next();
      } else {
        const newShop = await this.shopsRepository.insert({ domain: shopifyShopData.domain, shopify_id: shopifyShopData.id, session: sessionJSON, currency: shopifyShopData.currency });
        await this.analyticsRepository.insert({ shop_id: newShop.identifiers[0].id })
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  }
}
