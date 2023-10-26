import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { CommonController } from '@common/common.controller'
import { CommonService } from '@common/common.service'

@Module({
	imports: [ConfigerModule],
	controllers: [CommonController],
	providers: [CommonService]
})
export class CommonModule {}
