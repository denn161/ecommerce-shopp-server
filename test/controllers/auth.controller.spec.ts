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
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module'
  

const mockedUser = {
	username:"Jhone",
	email:'jhone@mail.ru',
	password:'jhone123'
}


 describe('Auth controller',()=>{
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
				AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
		app.use(
			session({
				secret: 'keywords',
				resave: false,
				saveUninitialized: false,
			}),
		);
		app.use(passport.initialize());
		app.use(passport.session());
    await app.init();
  });

	beforeEach(async()=>{
     const user = new User() 
		 const hashPassword = await bcrypt.hash(mockedUser.password,12) 
		 user.username = mockedUser.username 
		 user.email = mockedUser.email 
		 user.password =hashPassword 
		 
	return user.save()
   

	})

	afterEach(async ()=>{   
		await User.destroy({where:{username:mockedUser.username}})		 
	 
	})

	it('should login user',async ()=>{		

		const response = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

		expect(response.body.user.username).toBe(mockedUser.username)
	  expect(response.body.msg).toBe('Logged in')
		expect(response.body.user.email).toBe(mockedUser.email)
	})    


	it('should login check',async ()=>{		

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

		 const loginCheck = await request(app.getHttpServer())
		.get('/users/login-check')
		 .set('Cookie',login.headers['set-cookie']) 

		 expect(loginCheck.body.username).toBe(mockedUser.username)
		 expect(loginCheck.body.email).toBe(mockedUser.email)

	
	})   

	it('should user logou',async ()=>{
      
		 const response = await request(app.getHttpServer()) 
		 .get('/users/logout') 

		 expect(response.body.msg).toBe('Session has ended')

	})


 })
