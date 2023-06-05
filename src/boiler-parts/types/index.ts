import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Op } from 'sequelize'

export interface IBilerPartsQuery {
  limit: string;
  offset: string;
  boilers:string|undefined 
  parts:string|undefined 
  priceFrom:string|undefined 
  priceTo:string |undefined
}

export interface IFilterBoiler {
   boiler_manufacturer:string|undefined 
   price:{
    [Op.between]:number[]
   }  
   parts_manufacturer:string|undefined
}

export class BoilerParts {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  boiler_manufacturer: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  parts_manufacturer: string;

  @ApiProperty({ example: 1234 })
  price: number;

  @ApiProperty({ example: faker.lorem.word() })
  name: string;

  @ApiProperty({ example: faker.internet.password() })
  vendor_code: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  description: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  compatibility: string;

  @ApiProperty({ example: faker.image.city() })
  images: string;

  @ApiProperty({ example: 5 })
  in_stock: number;

  @ApiProperty({ example: true })
  bestseller: boolean;

  @ApiProperty({ example: true })
  fresh: boolean;

  @ApiProperty({ example: 123 })
  popularity: number;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  updatedAt: string;
}

export class PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  rows: BoilerParts;
}

export class BestSellers extends BoilerParts {
  @ApiProperty({ example: true })
  bestseller: boolean;
}

export class BestSellersResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  rows: BestSellers;
}

export class FreshBoilerParts extends BoilerParts {
  @ApiProperty({ example: true })
  fresh: boolean;
}

export class FreshBoilerPartsResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: BoilerParts, isArray: true })
  rows: FreshBoilerParts;
}

export class SearchProductByNameRequest {
  @ApiProperty({ example: 'Product search name' })
  name: string;
}

export class SearchProductByNameResponse extends BoilerParts {}

export class SearchRequest {
  @ApiProperty({ example: 'r' })
  search: string;
}

export class SearchResponse extends PaginateAndFilterResponse {}

export class FindOneResponseById extends BoilerParts {}
