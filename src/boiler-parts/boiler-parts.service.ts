import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'
import { BoilerParts } from './boiler-parts.model'
import { IBilerPartsQuery, IFilterBoiler } from './types'
import {Op} from 'sequelize'


@Injectable()
export class BoilerPartsService {
   constructor(@InjectModel(BoilerParts) private boilerPartsModel:typeof BoilerParts ){} 

   async paginateAndFilter(query:IBilerPartsQuery):Promise<{count:number,rows:BoilerParts[]}>{
      const limit = +query.limit 
      const offset = +query.offset*20
      const filter = {} as Partial<IFilterBoiler>
      
      if(query.priceFrom&&query.priceTo){
           filter.price = {
            [Op.between]:[+query.priceFrom,+query.priceTo]
           }
      }

      if(query.boilers){
           filter.boiler_manufacturer=JSON.parse(decodeURIComponent(query.boilers))
      }

      if(query.parts){
         filter.parts_manufacturer=JSON.parse(decodeURIComponent(query.parts))
    }

      return this.boilerPartsModel.findAndCountAll({
         limit,
         offset,
         where:filter
      })
   }
   async bestsellersProduct():Promise<{count:number,rows:BoilerParts[]}>{
      return this.boilerPartsModel.findAndCountAll({
         where:{
            bestseller:true
         }
      })
   }

   async freshProduct():Promise<{count:number,rows:BoilerParts[]}>{
      return this.boilerPartsModel.findAndCountAll({
         where:{
            fresh:true
         }
      })
   }

   async findOne(id:number|string):Promise<BoilerParts>{
        return this.boilerPartsModel.findOne({where:{id}})
   }

   async findOneByName(name:string):Promise<BoilerParts>{
        return this.boilerPartsModel.findOne({where:{name}})
   }
   async searchProductByStr(str:string):Promise<{count:number,rows:BoilerParts[]}>{
      return this.boilerPartsModel.findAndCountAll({
         limit:20,
         where:{
            name:{[Op.like]:`%${str}%`}
         }
      })
 }
}
