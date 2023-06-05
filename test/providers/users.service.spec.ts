import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelize.config'
import { User } from 'src/users/users.model'
import { UsersModule } from 'src/users/users.module'
import * as bcrypt from 'bcryptjs'
import { UsersService } from 'src/users/users.service'

 
 describe('Users services',()=>{
   let app:INestApplication 
	 let userService:UsersService

	   
	 beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ SequelizeModule.forRootAsync({
				imports:[ConfigModule],
				useClass:SequelizeConfigService
				}),
				ConfigModule.forRoot({
					load:[databaseConfig]
				}),
				UsersModule,],
    }).compile();
    
		userService = moduleFixture.get<UsersService>(UsersService)
    app = moduleFixture.createNestApplication();
    await app.init();
  });	

	afterEach(async ()=>{   
		 await User.destroy({where:{username:'Test'}})		 
	})

	it('should create user',async ()=>{

		const newUser = {
			 username:'Test',
			 email:'test@mail.ru',
			 password:"test123"
		}
    
		const user = await userService.createUser(newUser) as User 
		
		const isPassword = await bcrypt.compare(newUser.password,user.password) 

		expect(isPassword).toBe(true) 
		expect(user.username).toBe(newUser.username) 
		expect(user.email).toBe(newUser.email) 




		
	

		 
	})    


 })
