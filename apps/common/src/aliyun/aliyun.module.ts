import { Module } from '@nestjs/common'
import { AliyunController } from '@common/aliyun/aliyun.controller'
import { AliyunService } from '@common/aliyun/aliyun.service'

@Module({
	controllers: [AliyunController],
	providers: [AliyunService]
})
export class AliyunModule {}
