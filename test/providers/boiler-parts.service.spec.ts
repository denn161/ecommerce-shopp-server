import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelize.config';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';

describe('Boiler parts service', () => {
  let app: INestApplication;
  let boilrePartsSevice: BoilerPartsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        BoilerPartsModule,
      ],
    }).compile();
    boilrePartsSevice = await moduleFixture.get<BoilerPartsService>(
      BoilerPartsService,
    );
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('should get one product', async () => {
    const product = await boilrePartsSevice.findOne(3);
    expect(product.dataValues).toEqual(
      expect.objectContaining({
        id: 3,
        price: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        vendor_code: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        fresh: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibiliti: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should get search product by string', async () => {
    const search = 'nos';
    const searchedPr = await boilrePartsSevice.searchProductByStr(search);

    expect(searchedPr.rows.length).toBeLessThanOrEqual(20);

    searchedPr.rows.forEach((el: any) => {
      expect(el.name.toLowerCase()).toContain(search);
      expect(el.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          price: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          fresh: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibiliti: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
  it('should get search product by name', async () => {
    const name = 'Ipsum numquam vel consectetur.';

    const product = await boilrePartsSevice.findOneByName(name);

    expect(product.dataValues).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        price: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        vendor_code: expect.any(String),
        name: 'Ipsum numquam vel consectetur.',
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        fresh: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibiliti: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should get bestseller product', async () => {
    const best = await boilrePartsSevice.bestsellersProduct();
    best.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          price: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: true,
          fresh: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibiliti: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should get fresh product', async () => {
    const fresh = await boilrePartsSevice.freshProduct();

    fresh.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          price: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          fresh: true,
          popularity: expect.any(Number),
          compatibiliti: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
