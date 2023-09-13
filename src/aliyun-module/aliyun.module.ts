import { Module } from '@nestjs/common'
import { AliyunOssService } from './aliyun-oss/aliyun-oss.service'

@Module({
	providers: [AliyunOssService]
})
export class AliyunModule {}
