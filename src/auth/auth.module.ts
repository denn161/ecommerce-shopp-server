import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { SessionSerializer } from './sessions/session.serialize'

@Module({
  imports:[UsersModule,PassportModule.register({session:true})],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,SessionSerializer]
})
export class AuthModule {}
