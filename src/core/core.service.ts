import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm'
import { usuCurrent } from '@/i18n'
import { CoreRequest, BatchRequest } from '@/interface/core.interface'
import * as Nanoid from 'nanoid'
import * as moment from 'dayjs'
import * as crypto from 'crypto'
const logger = new Logger('CoreService')

@Injectable()
export class CoreService {
	/**范围随机数**/
	public async createRandom(min: number, max: number) {
		return Math.ceil(Math.random() * (max - min) + min)
	}
	/**AES加密**/
	public async aesEncrypt(data: any, key: string, iv: string): Promise<string> {
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
		const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
		const hash = encrypted + cipher.final('hex')
		return Buffer.from(hash).toString('base64')
	}

	/**AES解密**/
	public async aesDecrypt<T>(text: string, key: string, iv: string): Promise<T> {
		const hash = Buffer.from(text, 'base64').toString()
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
		const decrypted = decipher.update(hash, 'hex', 'utf8')
		return JSON.parse(decrypted + decipher.final('utf8'))
	}

	/**创建16位时间戳UID**/
	public async createCustomUidByte() {
		const custom = Nanoid.customAlphabet('123456789')(3)
		return Number(Date.now().toString() + custom)
	}

	/**创建API Secret**/
	public async createCustomByte(size: number = 32, toLowerCase: boolean = false) {
		const uid = Nanoid.customAlphabet('0123456789ABCDEFGHIJKLMnopqrstuvwsyz')(size)
		return toLowerCase ? uid.toLowerCase() : uid
	}

	/**创建国际化实例**/
	public async usuCurrent() {
		return usuCurrent()
	}

	/**结果集合**/
	public async createResult<T extends Record<string, unknown>>(props: T) {
		return Object.assign(props, {
			code: HttpStatus.OK,
			timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
		})
	}

	public async RunCatch<T extends Object>(callback: (i18n: ReturnType<typeof usuCurrent>) => Promise<T>) {
		const i18n = await this.usuCurrent()
		try {
			return await callback(i18n)
		} catch (e) {
			logger.error(e)
			throw new HttpException(e.response || e.message || i18n.t('http.SERVICE_ERROR'), e.status || HttpStatus.BAD_REQUEST)
		}
	}

	/**数据验证处理**/
	public async nodeValidator<T>(
		option: { node: T; i18n: ReturnType<typeof usuCurrent> },
		props: Pick<CoreRequest<T>, 'name' | 'message' | 'empty' | 'close' | 'delete'>
	) {
		const { node, i18n } = option
		if (!props.empty?.value) {
			return node
		} else if (!node) {
			//不存在
			throw new HttpException(i18n.t('http.NOT_DONE', { args: { name: props.empty.message ?? props.name } }), HttpStatus.BAD_REQUEST)
		} else if (props.close && (node as any).status === 'disable') {
			//已禁用
			throw new HttpException(i18n.t('http.NOT_CLOSE', { args: { name: props.close.message ?? props.name } }), HttpStatus.BAD_REQUEST)
		} else if (props.delete && (node as any).status === 'delete') {
			//已删除
			throw new HttpException(
				i18n.t('http.NOT_DELETE', { args: { name: props.delete.message ?? props.name } }),
				HttpStatus.BAD_REQUEST
			)
		}
		return node
	}

	/**验证数据模型是否有效**/
	public async validator<T>(props: CoreRequest<T>): Promise<T> {
		return await this.RunCatch(async i18n => {
			const node = await props.model.findOne(props.options)
			return await this.nodeValidator({ node, i18n }, props)
		})
	}

	/**批量验证数据模型是否有效**/
	public async batchValidator<T>(props: BatchRequest<T>): Promise<{ list: Array<T>; total: number }> {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await props.model.findAndCount(props.options)
			return { list, total }
		})
	}

	/**自定义查询**/
	public async useCustomize<T>(
		model: Repository<T>,
		props: {
			where: Brackets
			join?: (e: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
		}
	) {
		return await this.RunCatch(async i18n => {
			const tb: SelectQueryBuilder<T> = model.createQueryBuilder('tb')
			if (props.join) {
				await props.join(tb)
			}
			return tb.where(props.where)
		})
	}

	/**创建时、验证数据模型是否已经存在**/
	public async haveCreate<T>(props: CoreRequest<T>): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node) {
				throw new HttpException(props.message ?? i18n.t('http.NOT_HAS', { args: { name: props.name } }), HttpStatus.BAD_REQUEST)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**编辑时、验证数据模型是否已经存在**/
	public async haveUpdate<T>(props: CoreRequest<T>, handler: (e: T) => boolean): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node && handler(node)) {
				throw new HttpException(i18n.t('http.NOT_HAS', { args: { name: props.name } }), HttpStatus.BAD_REQUEST)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
