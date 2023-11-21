import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { CacheCustomer } from '@/cache/cache-customer.service'
import { DataBaseService } from '@/service/database.service'
import { OSS_CLIENT, OSS_STS_CLIENT } from '@common/aliyun/aliyun.provider'
import { moment, divineCatchWherer, divineParsesheet, divineBufferToStream, divineStreamToBuffer } from '@/utils/utils-plugin'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { custom } from '@/utils/utils-configer'
import * as Client from 'ali-oss'
import * as dataBase from '@/entity'
import * as http from '@common/interface/aliyun.resolver'

@Injectable()
export class AliyunService extends CustomService {
	constructor(
		private readonly cacheCustomer: CacheCustomer,
		private readonly dataBase: DataBaseService,
		@Inject(OSS_CLIENT) protected readonly client: Client,
		@Inject(OSS_STS_CLIENT) protected readonly stsClient: Client.STS
	) {
		super()
	}

	/**文件流转换**/
	public async createStream(file, pathFolder = 'static') {
		const fieldName = file.originalname
		const suffix = fieldName.slice(fieldName.lastIndexOf('.') + 1).toLowerCase()
		const fileId = await divineIntNumber()
		const fileName = [fileId, suffix].join('.')
		const folder = ['basic', pathFolder, moment().format('YYYY-MM'), fileName].join('/')
		return { fileId, fileName, folder, fieldName, suffix, fileStream: await divineBufferToStream(file.buffer) }
	}

	/**删除文件**/
	public async deleteFiler(path: string) {
		return await this.client.delete(path)
	}

	/**创建OSS临时授权**/
	public async httpCreateStorageAuthorize(uid: string) {
		try {
			const rolearn = custom.aliyun.oss.rolearn
			const sessionname = custom.aliyun.oss.sessionname
			const result = await this.stsClient.assumeRole(rolearn, '', 7200, sessionname)
			await divineCatchWherer(result.res.statusCode !== HttpStatus.OK, {
				message: '授权失败',
				code: HttpStatus.NOT_IMPLEMENTED
			})
			return await divineResult({
				interval: 7000,
				endpoint: custom.aliyun.oss.endpoint,
				bucket: custom.aliyun.oss.bucket,
				region: custom.aliyun.oss.region,
				accessKeyId: result.credentials.AccessKeyId,
				accessKeySecret: result.credentials.AccessKeySecret,
				token: result.credentials.SecurityToken,
				expire: moment(result.credentials.Expiration).format('YYYY-MM-DD HH:mm:ss')
			})
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
		}
	}

	/**上传excel文件**/
	public async httpUploadStorageExceler(file, uid: string) {
		try {
			const sheet = await divineParsesheet(file.buffer, 10)
			const node = await this.createStream(file, 'excel')
			return this.customeCreate(this.dataBase.tableExceler, {
				uid,
				fileId: node.fileId,
				fieldName: node.fieldName,
				fileName: node.fileName,
				suffix: node.suffix,
				folder: node.folder,
				total: sheet.total,
				fileURL: `https://oss.lisfes.cn/basic/excel/2023-10/35871977524518149842.xlsx`
			}).then(async data => {
				return await divineResult({ ...data, list: sheet.list })
			})
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
		}
	}

	/**excel文件列表**/
	public async httpColumnStorageExceler(state: http.ColumnStorageExceler, uid: string) {
		// return this.dataBase.tableExceler
		// 	.createQueryBuilder('tb')
		// 	.leftJoinAndMapOne('tb.user', dataBase.TableCustomer, 'user', 'user.uid = tb.uid')
		// 	.getMany()

		return await this.customeAndCountr(this.dataBase.tableExceler, {
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid })
			}),
			order: { createTime: 'DESC' },
			skip: (state.page - 1) * state.size,
			take: state.size
		}).then(async ({ list, total }) => {
			return await divineResult({ total, list, size: state.size, page: state.page })
		})
	}
}
