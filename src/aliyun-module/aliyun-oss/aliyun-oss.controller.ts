import { Controller, Post, Get, Query, Request, HttpStatus, HttpException, UseInterceptors } from '@nestjs/common'
import { UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBody } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
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
		operation: { summary: '上传xlsx、csv文件' },
		response: { status: 200, description: 'OK', type: http.OSSResultExcelFile },
		consumes: ['multipart/form-data'],
		authorize: { login: true, error: true }
	})
	@ApiBody({ type: http.OSSUploadFile })
	@UseInterceptors(FileInterceptor('file'))
	public async httpCreateUploadExcel(
		@Request() request,
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
		return await this.aliyunOssService.httpCreateUploadExcel(file, request.user.uid)
	}

	@Get('/excel/column')
	@ApiDecorator({
		operation: { summary: 'excel文件列表' },
		customize: { status: 200, description: 'OK', type: http.OSSResultExcelFile },
		authorize: { login: true, error: true }
	})
	public async httpColumnExcelFile(@Request() request, @Query() query: http.ColumnExcelFile) {
		return await this.aliyunOssService.httpColumnExcelFile(query, request.user.uid)
	}

	@Get('/excel/basic')
	@ApiDecorator({
		operation: { summary: 'excel文件信息' },
		response: { status: 200, description: 'OK', type: http.OSSResultExcelFile },
		authorize: { login: true, error: true }
	})
	public async httpBasicExcelFile(@Request() request, @Query() query: http.BasicExcelFile) {
		return await this.aliyunOssService.httpBasicExcelFile(query, request.user.uid)
	}
}
