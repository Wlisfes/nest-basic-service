import { Controller, Post, Get, Put, Body, Query, HttpStatus, HttpException, UseInterceptors } from '@nestjs/common'
import { UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiConsumes, ApiProperty, ApiOperation, ApiBody } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import { faker, divineParsesheet, divineWritesheet } from '@/utils/utils-plugin'

class FileUploadDto {
	@ApiProperty({ type: 'string', format: 'binary' })
	file: any
}

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
		operation: { summary: '创建OSS-STS临时鉴权' },
		response: { status: 200, description: 'OK', type: Notice },
		consumes: ['multipart/form-data']
	})
	@ApiBody({ type: FileUploadDto })
	@UseInterceptors(
		FileInterceptor('file', {
			// fileFilter(r, file, callback) {
			// 	console.log(file)
			// 	if (['.csv', '.xlsx'].includes(file.originalname.slice(file.originalname.lastIndexOf('.')))) {
			// 		return callback(null, true)
			// 	}
			// 	return callback(new HttpException('文件类型错误', HttpStatus.BAD_REQUEST), false)
			// }
		})
	)
	public async httpCreateUploadExcel(
		@UploadedFile()
		//https://stackoverflow.com/questions/974079/setting-mime-type-for-excel-document
		// new ParseFilePipe({
		// 	validators: [new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', })],
		// 	errorHttpStatusCode: HttpStatus.BAD_REQUEST,
		// 	exceptionFactory: error => new HttpException('文件类型错误', HttpStatus.BAD_REQUEST)
		// }),
		// new ParseFilePipe({
		// 	validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
		// 	errorHttpStatusCode: HttpStatus.BAD_REQUEST,
		// 	exceptionFactory: error => new HttpException('文件大小不能超过5MB', HttpStatus.BAD_REQUEST)
		// })
		file
	) {
		const jsonData = Array.from({ length: 10 }, () => {
			return {
				receive: faker.internet.email(),
				name: faker.person.fullName()
			}
		})
		const buffer = await divineWritesheet(jsonData)
		console.log(buffer, jsonData)
		return await divineParsesheet(file.buffer)
	}
}
