import { Injectable,UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto'
import * as bcrypt from 'bcryptjs'
@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {} 

  async validate(dto:CreateAuthDto){ 
     const {username,password} =dto 
     
      console.log(username,password)
       const user = await this.userService.findOne({where:{username}}) 

       if(!user){
          throw  new UnauthorizedException('Invalid credentials')
       }

      const isPassword = await bcrypt.compare(password,user.password) 

      if(!isPassword){
        throw  new UnauthorizedException('Password is invalid')
      }

      return {
          userId:user.id,
          username:user.username,
          email:user.email
      }




  }
}
