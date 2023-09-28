import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { OSS_CLIENT, OSS_STS_CLIENT } from './aliyun-oss.provider'
import { divineResult, divineHandler, divineIntNumber } from '@/utils/utils-common'
import { moment, divineParsesheet } from '@/utils/utils-plugin'
import * as http from '@/aliyun-module/interface/aliyun-oss.interface'
import * as Client from 'ali-oss'
import * as stream from 'stream'
import * as path from 'path'

@Injectable()
export class AliyunOssService extends CoreService {
	constructor(
		@Inject(OSS_CLIENT) protected readonly client: Client,
		@Inject(OSS_STS_CLIENT) protected readonly stsClient: Client.STS,
		private readonly configService: ConfigService,
		private readonly entity: EntityService
	) {
		super()
	}

	/**文件流转换**/
	public async createStream(file, pathFolder: string = 'static') {
		const fieldName = file.originalname
		const suffix = path.extname(fieldName).toLowerCase()
		const fileId = divineIntNumber({ length: 20, min: 1, max: 9 })
		const fileName = fileId + suffix
		const folder = ['basic', pathFolder, moment().format('YYYY-MM'), fileName].join('/')
		const fileStream = new stream.PassThrough()
		fileStream.end(file.buffer)
		return {
			fileId,
			fileName,
			folder,
			fieldName,
			suffix: suffix.slice(1),
			fileStream
		}
	}

	/**删除文件**/
	public async deleteFiler(path: string) {
		return await this.RunCatch(async i18n => {
			return await this.client.delete(path)
		})
	}

	/**创建临时授权**/
	public async httpCreateAuthorize() {
		return await this.RunCatch(async i18n => {
			const rolearn = this.configService.get('OSS_ROLEARN')
			const sessionname = this.configService.get('OSS_SESSIONNAME')
			const result = await this.stsClient.assumeRole(rolearn, '', 7200, sessionname)
			await divineHandler(result.res.statusCode !== 200, () => {
				throw new HttpException(`授权失败`, HttpStatus.NOT_IMPLEMENTED)
			})
			return await divineResult({
				interval: 7000,
				endpoint: this.configService.get('OSS_ENDPOINT'),
				bucket: this.configService.get('OSS_BUCKET'),
				region: this.configService.get('OSS_REGION'),
				accessKeyId: result.credentials.AccessKeyId,
				accessKeySecret: result.credentials.AccessKeySecret,
				token: result.credentials.SecurityToken,
				expire: moment(result.credentials.Expiration).format('YYYY-MM-DD HH:mm:ss')
			})
		})
	}

	/**上传excel文件**/
	public async httpCreateUploadExcel(file, uid: number) {
		return await this.RunCatch(async i18n => {
			const sheet = await divineParsesheet(file.buffer)
			const excel = await this.createStream(file, 'excel')
			const response = await this.client.putStream(excel.folder, excel.fileStream)
			await divineHandler(response.res.status !== HttpStatus.OK, () => {
				throw new HttpException(`上传失败`, response.res.status ?? HttpStatus.BAD_REQUEST)
			})
			const user = await this.validator({
				model: this.entity.user,
				name: '账号',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { uid } }
			})
			const node = await this.entity.basicExcel.create({
				fileId: excel.fileId,
				fieldName: excel.fieldName,
				fileName: excel.fileName,
				suffix: excel.suffix,
				folder: excel.folder,
				total: sheet.total,
				fileURL: response.url,
				user
			})
			return await this.entity.basicExcel.save(node).then(async () => {
				return await divineResult({
					suffix: excel.suffix,
					fileId: excel.fileId,
					fieldName: excel.fieldName,
					fileName: excel.fileName,
					folder: excel.folder,
					total: sheet.total,
					list: sheet.list,
					fileURL: response.url
				})
			})
		})
	}

	/**excel文件列表**/
	public async httpColumnExcelFile(props: http.ColumnExcelFile, uid: number) {
		return await this.RunCatch(async i18n => {
			const { list, total } = await this.batchValidator({
				model: this.entity.basicExcel,
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('user.uid = :uid', { uid })
					}),
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			})
			return await divineResult({ list, total, size: props.size, page: props.page })
		})
	}
}
