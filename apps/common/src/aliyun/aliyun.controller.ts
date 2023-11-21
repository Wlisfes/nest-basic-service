import { Controller, Post, Request, HttpStatus, HttpException, UseInterceptors } from '@nestjs/common'
import { UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBody } from '@nestjs/swagger'
import { AliyunService } from '@common/aliyun/aliyun.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import * as dataBase from '@/entity'
import * as http from '@common/interface/aliyun.resolver'

@ApiTags('阿里云模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@Post('/create/storage/authorize')
	@ApiDecorator({
		operation: { summary: '创建OSS-STS临时鉴权' },
		response: { status: 200, description: 'OK' },
		authorize: { login: true, error: true }
	})
	public async httpCreateStorageAuthorize(@Request() request: { user: dataBase.TableCustomer }) {
		return await this.aliyunService.httpCreateStorageAuthorize(request.user.uid)
	}

	@Post('/upload/storage/exceler')
	@ApiDecorator({
		operation: { summary: '上传xlsx、csv文件' },
		response: { status: 200, description: 'OK', type: dataBase.TableExceler },
		consumes: ['multipart/form-data'],
		authorize: { login: true, error: true }
	})
	@ApiBody({ type: http.CreateUploadExceler })
	@UseInterceptors(FileInterceptor('file'))
	public async httpCreateUploadExceler(
		@Request() request,
		@UploadedFile(
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
		return await this.aliyunService.httpCreateUploadExceler(file, request.user.uid)
	}
}
