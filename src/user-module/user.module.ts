import { Module } from '@nestjs/common'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'
import { PackageService } from './package/package.service'
import { PackageController } from './package/package.controller'

@Module({
	controllers: [UserController, PackageController],
	providers: [UserService, PackageService]
})
export class UserModule {}
