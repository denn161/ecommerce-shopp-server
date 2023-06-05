import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelize.config';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcryptjs';
import * as request from 'supertest';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

const mockedUser = {
  username: 'Jhone',
  email: 'jhone@mail.ru',
  password: 'jhone123',
};

describe('Auth service', () => {
  let app: INestApplication;
  let authService: AuthService;

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
        AuthModule,
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
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

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('should login user', async () => {
    const { email, ...result } = mockedUser;

    const user = await authService.validate(result);

    expect(user.username).toBe(mockedUser.username);
    expect(user.email).toBe(mockedUser.email);
  });
});
