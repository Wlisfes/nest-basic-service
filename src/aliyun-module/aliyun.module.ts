import { Module, DynamicModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AliyunOssService } from './aliyun-oss/aliyun-oss.service'

@Module({})
export class AliyunModule {
	static register(option: Record<string, any>): DynamicModule {
		console.log(option)
		return {
			module: AliyunModule
		}
	}
}
