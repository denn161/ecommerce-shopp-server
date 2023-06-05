import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class BoilerParts extends Model {
  @Column
  boiler_manufacturer: string;
  @Column({ defaultValue: 0 })
  price: number;
  @Column
  parts_manufacturer: string;

  @Column
  vendor_code: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  images: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: false })
  fresh: boolean;

  @Column
  popularity: number;

  @Column
  compatibiliti: string;
}
