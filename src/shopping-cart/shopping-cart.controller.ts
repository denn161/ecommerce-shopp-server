import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Put } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { AuthenticatedQuard } from 'src/auth/quard/authenticated.quard'
import { ApiBody, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { AddToCartResponse, GetAllResponse, TotalPriceRequest, TotalPriceResponse, UpdateCountRequest, UpdateCountResponse } from './types'

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}
  
  @ApiOkResponse({type:[GetAllResponse]})
  @UseGuards(AuthenticatedQuard)
  @Get(':id')
  @HttpCode(200)
  async getAll(@Param('id') userId:string|number){
      return this.shoppingCartService.findAll(userId)
  }
   
  @ApiOkResponse({type:AddToCartResponse})
  @UseGuards(AuthenticatedQuard)
  @Post('/add')
  @HttpCode(200) 
  async addToCart(@Body() dto:CreateShoppingCartDto){
      return this.shoppingCartService.addToCart(dto)
  }
   
  @ApiBody({type:UpdateCountRequest})
  @ApiOkResponse({type:UpdateCountResponse})
  @UseGuards(AuthenticatedQuard)
  @Put('/count/:id')
  @HttpCode(200) 
  async updateCount(@Body(){count}:{count:number},@Param('id')partId:number|string){
      return this.shoppingCartService.updateCount(partId,count)
  }
   
  @ApiBody({type:TotalPriceRequest})
  @ApiOkResponse({type:TotalPriceResponse})
  @UseGuards(AuthenticatedQuard)
  @Put('/total-price/:id')
  @HttpCode(200) 
  async updateTotalPrice(@Body(){totalPrice}:{totalPrice:number},@Param('id')partId:number|string){
      return this.shoppingCartService.updateTotalPrice(totalPrice,partId)
  }
   

  @UseGuards(AuthenticatedQuard)
  @Delete('/one/:id')
 async removeOne(@Param('id') partId: string|number) {
    return this.shoppingCartService.removeProduct(partId)
  }

  @UseGuards(AuthenticatedQuard)
  @Delete('/all/:id')
 async removeAll(@Param('id') userId: string|number) {
    return this.shoppingCartService.removeAllProducts(userId)
  }

  
}
