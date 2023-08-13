import { Module, Global } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Global()
@Module({
	imports: [JwtModule, HttpModule],
	controllers: [UserController],
	providers: [JwtService, UserService],
	exports: [JwtService, UserService]
})
export class UserModule {}
