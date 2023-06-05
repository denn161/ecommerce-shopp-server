import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios'
import { CheckPaymentDto } from './dto/check-payment.dto'
import { CreatePaymentDto } from './dto/create-payment.dto';


@Injectable()
export class PaymentService {
 

  async createPayment(dto:CreatePaymentDto){
    
      try {
        const {data} = await axios({
          method:"POST",
          url:'https://api.yookassa.ru/v3/payments',
          headers:{
           "Content-Type":"application/json",
           'Idempotence-Key':Date.now()
          },
          auth:{
            username:"318787",
            password:'test_2uuHxk9JzGfukjRZiBwaQE9F4RU7hiRzdq7Fqdza2kg'
          },
          data:{
           amount: {
             value: dto.amount,
             currency: "RUB"
           },
           capture:true,
           confirmation:{
             type:'redirect',
             return_url:'http://localhost:3001/order'
           },
           description:dto.description
         
          }
       })

       return data
        
      } catch (error) {
         throw new ForbiddenException(error)
      }

  }

  async checkPayment(dto:CheckPaymentDto){
    try {
       console.log(dto.paymentId)
      const {data} = await axios({
        method:"GET",
        url:`https://api.yookassa.ru/v3/payments/${dto.paymentId}`,      
        auth:{
          username:"318787",
          password:'test_2uuHxk9JzGfukjRZiBwaQE9F4RU7hiRzdq7Fqdza2kg'
        }       
     })

     return data
      
    } catch (error) {
       throw new ForbiddenException(error)
    }



  }
}
