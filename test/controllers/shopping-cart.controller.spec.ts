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
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service'
import { UsersService } from 'src/users/users.service'
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model'
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module'
  

const mockedUser = {
	username:"Jhone",
	email:'jhone@mail.ru',
	password:'jhone123'
}

const mockedShopDto = {
	  userId:3,
		productId:3,
		username:'Jhone'
}


 describe('Shopping cart controller',()=>{
   let app:INestApplication 
	 let boilerPartsService: BoilerPartsService;  
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
				BoilerPartsModule,
				AuthModule,
				ShoppingCartModule],
    }).compile();
		boilerPartsService = await moduleFixture.get<BoilerPartsService>(
      BoilerPartsService,
    );
		userService = moduleFixture.get<UsersService>(UsersService)
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

	beforeEach(async()=>{
		const cart = new ShoppingCart() 
		const product = await boilerPartsService.findOne(1)       
		const user = await userService.findOne({where:{username:mockedUser.username}}) 
		cart.userId =user.id 
		cart.partId = product.id 
		cart.boiler_manufacturer = product.boiler_manufacturer 
		cart.parts_manufacturer = product.parts_manufacturer 
		cart.price = product.price 
		cart.in_stock = product.in_stock 
		cart.image =JSON.parse(product.images)[0] 
		cart.name = product.name 
		cart.total_price = product.price  
		

return cart.save()	

 })
	afterEach(async ()=>{   
		await User.destroy({where:{username:mockedUser.username}})		
		await ShoppingCart.destroy({where:{partId:1}}) 	 
	})	 


	it('should all products in cart',async()=>{

	const login = await request(app.getHttpServer()) 
 	.post('/users/login').send({username:mockedUser.username, password:mockedUser.password})			
 
	  const user = await userService.findOne({where:{username:mockedUser.username}}) 

	 const response = await request(app.getHttpServer()) 
	  	.get(`/shopping-cart/${user.id}`)	   
	 	  .set('Cookie',login.headers['set-cookie']) 
    
	  	 expect(response.body).toEqual(
	  		expect.arrayContaining([{
					id: expect.any(Number),
          userId:user.id,
          partId: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          price: expect.any(Number),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          image: expect.any(String),
          count: expect.any(Number),
          total_price: expect.any(Number),
          in_stock: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
			}])
		 )

	})



	it('should add product to cart ',async()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})				 

     await request(app.getHttpServer()) 
	    	.post(`/shopping-cart/add`)
			  .send({username:mockedUser.username,productId:3})
		 .set('Cookie',login.headers['set-cookie']) 

		 const user = await userService.findOne({where:{username:mockedUser.username}}) 

		 const response = await request(app.getHttpServer()) 
		 .get(`/shopping-cart/${user.id}`)	   
			.set('Cookie',login.headers['set-cookie']) 
     
		 expect(response.body.find((item)=>item.partId===3)).toEqual(
			expect.objectContaining({
				  id: expect.any(Number),
          userId:user.id,
          partId:3,
          boiler_manufacturer: expect.any(String),
          price: expect.any(Number),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          image: expect.any(String),
          count: expect.any(Number),
          total_price: expect.any(Number),
          in_stock: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
			})
		 )

	})

	it('should update count product to cart ',async()=>{
		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})				 

    const response= await request(app.getHttpServer()) 
	    	.put(`/shopping-cart/count/1`)
			  .send({count:2})
		 .set('Cookie',login.headers['set-cookie']) 
	
		 expect(response.body).toEqual({count:2})

	})

	it('should update totalPrice product to cart ',async()=>{
		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})			
		
		const part = await boilerPartsService.findOne(1);

    const response= await request(app.getHttpServer()) 
	    	.put(`/shopping-cart/total-price/1`)
			  .send({totalPrice:part.price*5})
		 .set('Cookie',login.headers['set-cookie']) 
	
		 expect(response.body).toEqual({totalPrice:part.price*5})

	})

	it('should delete product of shopping cart',async ()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})			
   
		await request(app.getHttpServer()).delete('/shopping-cart/one/1').set('Cookie',login.headers['set-cookie']) 
     
		const user = await userService.findOne({where:{username:mockedUser.username}}) 
    
		const response = await request(app.getHttpServer()) 
		.get(`/shopping-cart/${user.id}`)	   
		 .set('Cookie',login.headers['set-cookie'])  

		 expect(response.body.find((item)=>item.partId===1)).toBeUndefined()


	})

	it('should delete all products of shopping cart',async ()=>{

		const login = await request(app.getHttpServer()) 
		.post('/users/login').send({username:mockedUser.username,password:mockedUser.password})			

		const user = await userService.findOne({where:{username:mockedUser.username}}) 
   
		await request(app.getHttpServer()).delete(`/shopping-cart/all/${user.id}`).set('Cookie',login.headers['set-cookie'])	
    
		const response = await request(app.getHttpServer()) 
		.get(`/shopping-cart/${user.id}`)	   
		 .set('Cookie',login.headers['set-cookie'])  

		 expect(response.body).toStrictEqual([])


	})



	

	

 })
