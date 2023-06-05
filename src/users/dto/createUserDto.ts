import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createUserDto {
  @ApiProperty({ example: 'Denis' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'denn@mail.ru' })
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: 'qwerasdf' })
  @IsNotEmpty()
  password: string;
}
