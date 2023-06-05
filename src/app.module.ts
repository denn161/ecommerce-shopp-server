import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { databaseConfig } from './config/configuration'
import { SequelizeConfigService } from './config/sequelize.config'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoilerPartsModule } from './boiler-parts/boiler-parts.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { PaymentModule } from './payment/payment.module';


@Module({
  imports: [
    SequelizeModule.forRootAsync({
    imports:[ConfigModule],
    useClass:SequelizeConfigService
    }),
    ConfigModule.forRoot({
      load:[databaseConfig]
    }),
    UsersModule,
    AuthModule,
    BoilerPartsModule,
    ShoppingCartModule,
    PaymentModule
  ],
 
})
export class AppModule {}
