import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response, Request } from "express";
import { Webhook } from "../types/webhook.js";
import shopify from "../utils/shopify.js";

import { config } from 'dotenv';
config();

@Injectable()
export class createWebhooks implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const session = res.locals.shopify.session;

    const webhooks: Webhook[] = await shopify.api.rest.Webhook.all({
      session
    })

    console.log(webhooks)

    const cartUpdate = webhooks.find(webhook => webhook.topic.includes('carts/update'));
    const orderPaid = webhooks.find(webhook => webhook.topic.includes('orders/paid'));
    const appUninstalled = webhooks.find(webhook => webhook.topic.includes('app/uninstalled'));

    if (!cartUpdate) {
      const cartUpdateWebhook = new shopify.api.rest.Webhook({session});
      cartUpdateWebhook.address = `${process.env.HOST + '/'}storefront/cart/update`;
      cartUpdateWebhook.topic = 'carts/update';
      cartUpdateWebhook.format = 'json';
      await cartUpdateWebhook.save({
        update: true
      })
    }

    if (!orderPaid) {
      const customerUpdateWebhook = new shopify.api.rest.Webhook({session});
      customerUpdateWebhook.address = `${process.env.HOST + '/'}storefront/order/paid`;
      customerUpdateWebhook.topic = 'orders/paid';
      customerUpdateWebhook.format = 'json';
      await customerUpdateWebhook.save({
        update: true
      })
    }

    if (!appUninstalled) {
      const appUninstalledWebhook = new shopify.api.rest.Webhook({session});
      appUninstalledWebhook.address = `${process.env.HOST + '/'}storefront/app/uninstalled`;
      appUninstalledWebhook.topic = 'app/uninstalled';
      appUninstalledWebhook.format = 'json';
      await appUninstalledWebhook.save({
        update: true
      })
    }

    next();
  }
}