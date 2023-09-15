import { Controller, Post, Get, Put, Body, Query, Request, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'

@ApiTags('阿里云对象存储模块')
@Controller('aliyun-oss')
export class AliyunOssController {
	constructor(private readonly aliyunOssService: AliyunOssService) {}

	@Post('/create/authorize')
	@ApiDecorator({
		operation: { summary: '创建OSS-STS临时鉴权' },
		response: { status: 200, description: 'OK' },
		authorize: { login: true, error: true }
	})
	public async httpCreateAuthorize() {
		return await this.aliyunOssService.httpCreateAuthorize()
	}
}
