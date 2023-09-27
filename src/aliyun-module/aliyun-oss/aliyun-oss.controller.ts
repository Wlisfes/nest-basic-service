import { Controller, Post, Get, Put, Body, Query, Request, Response, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiConsumes, ApiProperty, ApiOperation, ApiBody } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import * as Excel from 'exceljs'

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
	@ApiOperation({ summary: '上传' })
	// @ApiDecorator({
	// 	operation: { summary: '创建OSS-STS临时鉴权' },
	// 	response: { status: 200, description: 'OK' }
	// 	// authorize: { login: true, error: true }
	// })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'List of cats',
		type: FileUploadDto
	})
	@UseInterceptors(FileInterceptor('file'))
	public async httpCreateUploadExcel(@UploadedFile() file) {
		const workbook = new Excel.Workbook()
		await workbook.xlsx.load(file.buffer)
		const worksheet = workbook.getWorksheet(1)

		const jsonData = []
		return await new Promise(resolve => {
			worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
				const rowData = {}

				row.eachCell((cell, colNumber) => {
					rowData[`column_${colNumber}`] = cell.value
				})

				jsonData.push(rowData)
			})
			console.log(file)
			console.log('jsonData:', jsonData.length, '----', jsonData)
			resolve({ length: jsonData.length, jsonData })
		})
	}
}
