import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelize.config';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcryptjs';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';

const mockedUser = {
  username: 'Jhone',
  email: 'jhone@mail.ru',
  password: 'jhone123',
};
describe('Shopping cart service', () => {
  let app: INestApplication;
  let boilerPartsService: BoilerPartsService;
  let userService: UsersService;
  let shoppingCartService: ShoppingCartService;
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
        ShoppingCartModule,
      ],
    }).compile();
    boilerPartsService = await moduleFixture.get<BoilerPartsService>(
      BoilerPartsService,
    );
    userService = moduleFixture.get<UsersService>(UsersService);
    shoppingCartService =
      moduleFixture.get<ShoppingCartService>(ShoppingCartService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const user = new User();
    const hashPassword = await bcrypt.hash(mockedUser.password, 12);
    user.username = mockedUser.username;
    user.email = mockedUser.email;
    user.password = hashPassword;

    return user.save();
  });

  beforeEach(async () => {
    const cart = new ShoppingCart();
    const product = await boilerPartsService.findOne(1);
    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });
    cart.userId = user.id;
    cart.partId = product.id;
    cart.boiler_manufacturer = product.boiler_manufacturer;
    cart.parts_manufacturer = product.parts_manufacturer;
    cart.price = product.price;
    cart.in_stock = product.in_stock;
    cart.image = JSON.parse(product.images)[0];
    cart.name = product.name;
    cart.total_price = product.price;

    return cart.save();
  });
  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
    await ShoppingCart.destroy({ where: { partId: 1 } });
  });

  it('should return all card items', async () => {
    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    const items = await shoppingCartService.findAll(user.id);

    items.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          userId: user.id,
          partId: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          price: expect.any(Number),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          image: expect.any(String),
          count: expect.any(Number),
          total_price: expect.any(Number),
          in_stock: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should add product to cart', async () => {
    await shoppingCartService.addToCart({
      username: mockedUser.username,
      productId: 3,
    });

    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    const items = await shoppingCartService.findAll(user.id);

    expect(items.find((item) => item.partId === 3)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        partId: 3,
        boiler_manufacturer: expect.any(String),
        price: expect.any(Number),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        count: expect.any(Number),
        total_price: expect.any(Number),
        in_stock: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
  it('should update count product to cart', async () => {
    const result = await shoppingCartService.updateCount(1, 3);

    expect(result).toEqual({ count: 3 });
  });

  it('should update total-price product to cart', async () => {
    const part = await boilerPartsService.findOne(1);
    const result = await shoppingCartService.updateTotalPrice(
      part.price * 5,
      1,
    );
    expect(result).toEqual({ totalPrice: part.price * 5 });
  });
  it('should delete product of cart', async () => {
    await shoppingCartService.removeProduct(1);

    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    const items = await shoppingCartService.findAll(user.id);

    expect(items.find((item) => item.partId === 1)).toBeUndefined();
  });
  it('should delete all products of cart', async () => {
    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });
    await shoppingCartService.removeAllProducts(user.id);

    const items = await shoppingCartService.findAll(user.id);

    expect(items).toStrictEqual([]);
  });
});
