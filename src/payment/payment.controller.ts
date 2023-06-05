import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthenticatedQuard } from 'src/auth/quard/authenticated.quard'
import { ApiOkResponse } from '@nestjs/swagger'
import { MakePaymentResponse } from './types'
import { CheckPaymentDto } from './dto/check-payment.dto'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
   
  @ApiOkResponse({type:MakePaymentResponse})
  @UseGuards(AuthenticatedQuard)
  @Post()
  @HttpCode(200)
 async create(@Body() dto:CreatePaymentDto) {
     return this.paymentService.createPayment(dto)
  }    
  
  @UseGuards(AuthenticatedQuard)
  @Post('/info') 
 async checkPayment(@Body() dto:CheckPaymentDto){
     return this.paymentService.checkPayment(dto)

  }
}
