import { Injectable, NotFoundException, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'
import { createUserDto } from './dto/createUserDto'
import { User } from './users.model'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModal:typeof User){}

	 findOne(filter:{
		where:{id?:string,username?:string,email?:string}
	}):Promise<User>{
		return this.userModal.findOne({...filter})

	}
	async createUser(dto:createUserDto){
		  
	    const user = new User()

			const existUserByName = await this.findOne({where:{username:dto.username}}) 

			const existUserByEmail = await this.findOne({where:{email:dto.email}})

			if(existUserByName){				 
				 return {warningMessage:'Пользователь с таким именем уже существует'}
			}

			if(existUserByEmail){
				return {warningMessage:'Пользовтаель с такой почтой уже существует'}
		 }

     const hashPassword = await bcrypt.hash(dto.password,12) 
		 user.username = dto.username 
		 user.email = dto.email 
		 user.password =hashPassword 
		 
		   user.save() 
      
		 return {user,success:true}
			
		 
		      
	}

}
