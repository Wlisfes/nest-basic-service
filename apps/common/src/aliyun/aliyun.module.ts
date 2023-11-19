import { Module } from '@nestjs/common'
import { AliyunController } from '@common/aliyun/aliyun.controller'
import { AliyunService } from '@common/aliyun/aliyun.service'
import { createOssProvider, createOssSTSProvider } from '@common/aliyun/aliyun.provider'

@Module({
	providers: [createOssProvider(), createOssSTSProvider(), AliyunService],
	controllers: [AliyunController]
})
export class AliyunModule {}
