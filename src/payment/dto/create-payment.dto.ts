import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreatePaymentDto {   
	@ApiProperty({example:2500}) 
	@IsNotEmpty() 
	 readonly amount:number 
  
	@ApiProperty({example:'Заказ №1 готов к выдаче'}) 
	@IsOptional() 
	readonly description?:string


}
