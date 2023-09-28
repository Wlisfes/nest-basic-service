import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { OSS_CLIENT, OSS_STS_CLIENT } from './aliyun-oss.provider'
import { divineResult, divineHandler, divineIntNumber } from '@/utils/utils-common'
import { moment, divineParsesheet } from '@/utils/utils-plugin'
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
		const suffix = path.extname(file.originalname).toLowerCase()
		const fileId = divineIntNumber({ length: 20, min: 1, max: 9 })
		const fileName = fileId + suffix
		const folder = ['basic', pathFolder, moment().format('YYYY-MM'), fileName].join('/')
		const fileStream = new stream.PassThrough()
		fileStream.end(file.buffer)
		return {
			fileId,
			fileName,
			folder,
			fileStream,
			fieldName: file.originalname
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
	public async httpCreateUploadExcel(file) {
		return await this.RunCatch(async i18n => {
			const sheet = await divineParsesheet(file.buffer)
			const target = await this.createStream(file, 'excel')
			// const response = await this.client.putStream(target.folder, target.fileStream)
			// await divineHandler(response.res.status !== HttpStatus.OK, () => {
			// 	throw new HttpException(`上传失败`, response.res.status ?? HttpStatus.BAD_REQUEST)
			// })
			return await divineResult({
				// fileURL: response.url,
				fileId: target.fileId,
				fieldName: target.fieldName,
				fileName: target.fileName,
				folder: target.folder,
				total: sheet.total,
				list: sheet.list
			})
		})
	}
}
