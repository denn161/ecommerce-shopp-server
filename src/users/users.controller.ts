import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedQuard } from 'src/auth/quard/authenticated.quard';
import { LocalAuthQuard } from 'src/auth/quard/localauth.quard';
import { createUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginCheckUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
	RegisterUserRequest,
	RegisterUserResponse,
} from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

	@ApiBody({type:RegisterUserRequest})
	@ApiOkResponse({type:RegisterUserResponse})
  @Post('/register')
  @HttpCode(200)
  async createUser(@Body() dto: createUserDto) {
    return this.userService.createUser(dto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthQuard)
  @HttpCode(200)
  async login(@Request() req: any) {
    return { user: req.user, msg: 'Logged in' };
  }

  @ApiOkResponse({ type: LoginCheckUserResponse })
  @Get('/login-check')
  @UseGuards(AuthenticatedQuard)
  async loginCheck(@Request() req: any) {
    return req.user;
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  async logout(@Request() req: any) {
    req.session.destroy();
    return { msg: 'Session has ended' };
  }
}
