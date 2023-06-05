import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service'
import { UsersService } from 'src/users/users.service'
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto'
import { ShoppingCart } from './shopping-cart.model';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private readonly shoppingCartModel: typeof ShoppingCart,
    private readonly userService:UsersService,private readonly boilerPartsService:BoilerPartsService
  ) {}

  findAll(userId:number|string):Promise<ShoppingCart[]>{ 
     return this.shoppingCartModel.findAll({where:{userId}})  
       
  }

  async addToCart(dto:CreateShoppingCartDto){
      const cart = new ShoppingCart() 
      const product = await this.boilerPartsService.findOne(dto.productId)       
      const user = await this.userService.findOne({where:{username:dto.username}}) 
      cart.userId =+user.id 
      cart.partId = product.id 
      cart.boiler_manufacturer = product.boiler_manufacturer 
      cart.parts_manufacturer = product.parts_manufacturer 
      cart.price = product.price 
      cart.in_stock = product.in_stock 
      cart.image =JSON.parse(product.images)[0] 
      cart.name = product.name 
      cart.total_price = product.price  

      return cart.save()
 

  }

  async updateCount(partId:number|string,count:number):Promise<{count:number}>{ 
      
    await this.shoppingCartModel.update({count},{where:{partId}})

    const product = await this.shoppingCartModel.findOne({where:{partId}})  

    return {count:product.count}
                

  }

  async updateTotalPrice(totatPrice:number,partId:number|string):Promise<{totalPrice:number}>{
      
      await this.shoppingCartModel.update({total_price:totatPrice},{where:{partId}}) 
         
      const part = await this.shoppingCartModel.findOne({where:{partId}})

      return {totalPrice:part.total_price}
  }

  async removeProduct(partId:number|string):Promise<void>{ 

    const part = await this.shoppingCartModel.findOne({where:{partId}}) 

    await part.destroy()
       
  }

  async removeAllProducts(userId:number|string){
      await this.shoppingCartModel.destroy({where:{userId}})
  }


}
