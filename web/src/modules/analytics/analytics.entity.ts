import { json } from "stream/consumers";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shop } from "../shops/shop.entity.js";

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shop_id: number;

  @OneToOne(() => Shop)
  @JoinColumn({ name: 'shop_id', referencedColumnName: 'id'})
  shop: Shop;

  @Column({ type: 'json', nullable: true})
  total_sales: string;

  @Column({ type: 'json', nullable: true })
  locations: string;

  @Column({ type: 'json', nullable: true })
  average_open_time: string;

  @Column({ type: 'json', nullable: true })
  average_price: string;

  @Column({ type: 'json', nullable: true })
  conversion_rates: string;

  @Column({ type: 'json', nullable: true })
  device_statistic: string;

  @Column({ type: 'json', nullable: true })
  top_sold: string;

  @Column({ type: 'json', nullable: true })
  top_abandoned: string;
}