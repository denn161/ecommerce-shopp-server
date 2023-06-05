import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger'
import { AuthenticatedQuard } from 'src/auth/quard/authenticated.quard'
import { BoilerPartsService } from './boiler-parts.service';
import { BestSellersResponse,FindOneResponseById, FreshBoilerPartsResponse, IBilerPartsQuery, PaginateAndFilterResponse, SearchProductByNameRequest, SearchProductByNameResponse, SearchRequest, SearchResponse } from './types';

@Controller('boiler-parts')
export class BoilerPartsController {
  constructor(private readonly boilerPartsService: BoilerPartsService) {}
  
  @ApiOkResponse({type:PaginateAndFilterResponse})
  @UseGuards(AuthenticatedQuard)
  @Get()
  @HttpCode(200)
  async paginateAndFilter(@Query() query: IBilerPartsQuery) {
    return this.boilerPartsService.paginateAndFilter(query);
  }  
   
  @ApiOkResponse({type:BestSellersResponse})
  @UseGuards(AuthenticatedQuard)
  @Get('bestsellers')
  @HttpCode(200)
  async bestProduct() {
    return this.boilerPartsService.bestsellersProduct();
  }
  
  @ApiOkResponse({type:FreshBoilerPartsResponse})
  @UseGuards(AuthenticatedQuard)
  @Get('fresh') 
  @HttpCode(200) 
  async freshProduct(){
     return this.boilerPartsService.freshProduct()
  }
   
  @ApiParam({name:'id'})
  @ApiOkResponse({type:FindOneResponseById})
  @UseGuards(AuthenticatedQuard)
  @Get('/find/:id') 
  @HttpCode(200)
  async findOne(@Param('id') id:string){
       return this.boilerPartsService.findOne(id)
  }
  
  @ApiBody({type:SearchRequest})
  @ApiOkResponse({type:SearchResponse})
  @UseGuards(AuthenticatedQuard)
  @Post('search') 
  @HttpCode(200)
  async searchProduct(@Body() {search}:{search:string}){
       return this.boilerPartsService.searchProductByStr(search)
  }
  @ApiBody({type:SearchProductByNameRequest})
  @ApiOkResponse({type:SearchProductByNameResponse})
  @UseGuards(AuthenticatedQuard)
  @Post('name') 
  @HttpCode(200)
  async searchProductByName(@Body() {name}:{name:string}){
       return this.boilerPartsService.findOneByName(name)
  }
}
