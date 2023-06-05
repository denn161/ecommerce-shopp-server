import { ApiProperty } from '@nestjs/swagger';


export class RegisterUserRequest{
	   @ApiProperty({example:'Denis'}) 
		 username:string 

		 @ApiProperty({example:'denn@mail.ru'})
		 email:string 

		 @ApiProperty({example:'qwerasdf123'}) 
		 password:string
}


export class RegisterUserResponse{

	@ApiProperty({example:1}) 
	id:number
	@ApiProperty({example:'Denis'}) 
	username:string 

	@ApiProperty({example:'denn@mail.ru'})
	email:string 

	@ApiProperty({example:'$2a$12$i.Lm3G9ycH6OH19VjNo63.Xjs9riRWEMiUI6xNVhuxkw/P71ktm4S'}) 
	password:string

  @ApiProperty({example:"2023-05-13T11:32:13.178Z"})
	updatedAt:string

	@ApiProperty({example:"2023-05-13T11:32:13.178Z"})
	createdAt:string   

}






export class LoginUserRequest {
  @ApiProperty({ example: 'Denis' })
  username: string;

  @ApiProperty({ example: 'qwerasdf123' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: 1,
        username: 'Denis',
        email: 'denn@mail.ru',
      },
    },
  })
  user: {
    userId: number;
    username: string;
    email: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session has ended' })
  msg: string;
}

export class LoginCheckUserResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Denis' })
  username: string;

  @ApiProperty({ example: 'denn@mail.ru' })
  email: string;
}
