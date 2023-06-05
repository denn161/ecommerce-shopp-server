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
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module'
  

const mockedUser = {
	username:"Jhone",
	email:'jhone@mail.ru',
	password:'jhone123'
}


 describe('Boiler parts controller',()=>{
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
				BoilerPartsModule,
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

	it('should get one product',async()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

      const response = await request(app.getHttpServer()) 
	  	.get('/boiler-parts/find/3')
		 .set('Cookie',login.headers['set-cookie'])  
     
		 expect(response.body).toEqual(
			expect.objectContaining({
				id:3,
				price:expect.any(Number),
				boiler_manufacturer:expect.any(String),
				parts_manufacturer:expect.any(String),
				vendor_code:expect.any(String),
				name:expect.any(String),
				description:expect.any(String),
				images:expect.any(String),
				in_stock:expect.any(Number),
				bestseller:expect.any(Boolean),
				fresh:expect.any(Boolean),
				popularity:expect.any(Number),
				compatibiliti:expect.any(String),
				createdAt:expect.any(String),
				updatedAt:expect.any(String)
			})
		 )




	})

	it('should get bestseller product',async()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

      const response = await request(app.getHttpServer()) 
	  	.get('/boiler-parts/bestsellers')
		 .set('Cookie',login.headers['set-cookie'])  
     
		 expect(response.body.rows).toEqual(
			expect.arrayContaining([{
				id:expect.any(Number),
				price:expect.any(Number),
				boiler_manufacturer:expect.any(String),
				parts_manufacturer:expect.any(String),
				vendor_code:expect.any(String),
				name:expect.any(String),
				description:expect.any(String),
				images:expect.any(String),
				in_stock:expect.any(Number),
				bestseller:true,
				fresh:expect.any(Boolean),
				popularity:expect.any(Number),
				compatibiliti:expect.any(String),
				createdAt:expect.any(String),
				updatedAt:expect.any(String)
			}])
		 )




	})


	it('should get fresh product',async()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

      const response = await request(app.getHttpServer()) 
	  	.get('/boiler-parts/fresh')
		 .set('Cookie',login.headers['set-cookie'])  
     
		 expect(response.body.rows).toEqual(
			expect.arrayContaining([{
				id:expect.any(Number),
				price:expect.any(Number),
				boiler_manufacturer:expect.any(String),
				parts_manufacturer:expect.any(String),
				vendor_code:expect.any(String),
				name:expect.any(String),
				description:expect.any(String),
				images:expect.any(String),
				in_stock:expect.any(Number),
				bestseller:expect.any(Boolean),
				fresh:true,
				popularity:expect.any(Number),
				compatibiliti:expect.any(String),
				createdAt:expect.any(String),
				updatedAt:expect.any(String)
			}])
		 )




	})

	it('should get search product by string',async()=>{
      const body = {
				search:'nos'
			}
		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

      const response = await request(app.getHttpServer()) 
	  	.post('/boiler-parts/search')
		  .send(body)
		  .set('Cookie',login.headers['set-cookie'])  
     
			expect(response.body.rows.length).toBeLessThanOrEqual(20)
       
			response.body.rows.forEach((el:any)=>{ 
		    expect(el.name.toLowerCase()).toContain(body.search)
				  
			})

		 expect(response.body.rows).toEqual(
			expect.arrayContaining([{
				id:expect.any(Number),
				price:expect.any(Number),
				boiler_manufacturer:expect.any(String),
				parts_manufacturer:expect.any(String),
				vendor_code:expect.any(String),
				name:expect.any(String),
				description:expect.any(String),
				images:expect.any(String),
				in_stock:expect.any(Number),
				bestseller:expect.any(Boolean),
				fresh:expect.any(Boolean),
				popularity:expect.any(Number),
				compatibiliti:expect.any(String),
				createdAt:expect.any(String),
				updatedAt:expect.any(String)
			}])
		 )




	})


	it('should get search product by name',async()=>{
		const body = {
			name:'Ipsum numquam vel consectetur.'
		}
	const login = await request(app.getHttpServer()) 
	.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})		

		const response = await request(app.getHttpServer()) 
		.post('/boiler-parts/name')
		.send(body)
		.set('Cookie',login.headers['set-cookie']) 
	

	 expect(response.body).toEqual(
		expect.objectContaining({
			id:expect.any(Number),
			price:expect.any(Number),
			boiler_manufacturer:expect.any(String),
			parts_manufacturer:expect.any(String),
			vendor_code:expect.any(String),
			name:'Ipsum numquam vel consectetur.',
			description:expect.any(String),
			images:expect.any(String),
			in_stock:expect.any(Number),
			bestseller:expect.any(Boolean),
			fresh:expect.any(Boolean),
			popularity:expect.any(Number),
			compatibiliti:expect.any(String),
			createdAt:expect.any(String),
			updatedAt:expect.any(String)
		})
	 )




})

	

 })
