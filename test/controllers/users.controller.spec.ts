import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelize.config'
import { User } from 'src/users/users.model'
import { UsersModule } from 'src/users/users.module'
import * as bcrypt from 'bcryptjs'
import * as request from 'supertest'

 const mockedUser = {
	  username:"Jhone",
		email:'jhone@mail.ru',
		password:'jhone123'
 }

 describe('Users controller',()=>{
   let app:INestApplication 

	   
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

	// beforeEach(async()=>{
  //    const user = new User() 
	// 	 const hashPassword = await bcrypt.hash(mockedUser.password,12) 
	// 	 user.username = mockedUser.username 
	// 	 user.email = mockedUser.email 
	// 	 user.password =hashPassword 
		 
	// return user.save()
   

	// })

	afterEach(async ()=>{   
		 await User.destroy({where:{username:'Test'}})		 
	})

	it('Create user',async ()=>{

		const newUser = {
			 username:'Test',
			 email:'test@mail.ru',
			 password:"test123"
		}

		const response = await request(app.getHttpServer()) 
		.post('/users/register').send(newUser) 

		 const isPassword = await bcrypt.compare(newUser.password,response.body.password) 

		expect(response.body.username).toBe(newUser.username)
		expect(isPassword).toBe(true)
		expect(response.body.email).toBe(newUser.email)
	})    


 })
