import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateShoppingCartDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly productId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId?: number;
	
  @ApiProperty({ example: 'Denis' })
  @IsNotEmpty()
  readonly username: string;
}
