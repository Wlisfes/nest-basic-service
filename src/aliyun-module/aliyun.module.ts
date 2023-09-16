import { Module, Global } from '@nestjs/common'
import { createOssProvider, createOssSTSProvider } from '@/aliyun-module/aliyun-oss/aliyun-oss.provider'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import { AliyunOssController } from '@/aliyun-module/aliyun-oss/aliyun-oss.controller'

@Global()
@Module({
	providers: [createOssProvider(), createOssSTSProvider(), AliyunOssService],
	controllers: [AliyunOssController],
	exports: [AliyunOssService]
})
export class AliyunModule {}
