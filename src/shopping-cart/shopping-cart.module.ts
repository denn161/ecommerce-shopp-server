import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { SequelizeModule } from '@nestjs/sequelize'
import { ShoppingCart } from './shopping-cart.model'
import { UsersModule } from 'src/users/users.module'
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module'

@Module({
  imports:[SequelizeModule.forFeature([ShoppingCart]),UsersModule,BoilerPartsModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService]
})
export class ShoppingCartModule {}
