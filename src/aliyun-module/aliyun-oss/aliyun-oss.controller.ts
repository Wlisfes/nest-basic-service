import { Controller, Post, Get, Put, Body, Query, HttpStatus, HttpException, UseInterceptors } from '@nestjs/common'
import { UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBody } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import { divineParsesheet } from '@/utils/utils-plugin'
import * as http from '@/aliyun-module/interface/aliyun-oss.interface'

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

	@Post('/resolve/excel')
	@ApiDecorator({
		operation: { summary: '解析上传xlsx、csv文件' },
		response: { status: 200, description: 'OK', type: Notice },
		consumes: ['multipart/form-data']
	})
	@ApiBody({ type: http.OSSUploadFile })
	@UseInterceptors(FileInterceptor('file'))
	public async httpCreateUploadExcel(
		@UploadedFile(
			//https://stackoverflow.com/questions/974079/setting-mime-type-for-excel-document
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: RegExp('(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)$')
					})
				],
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
				exceptionFactory: error => new HttpException('文件类型错误', HttpStatus.BAD_REQUEST)
			}),
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
				errorHttpStatusCode: HttpStatus.BAD_REQUEST,
				exceptionFactory: error => new HttpException('文件大小不能超过5MB', HttpStatus.BAD_REQUEST)
			})
		)
		file
	) {
		return await divineParsesheet(file.buffer)
	}
}
