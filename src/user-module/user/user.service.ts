import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { HttpService } from '@nestjs/axios'
import { compareSync } from 'bcryptjs'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { User } from '@/entity/tb-user.entity'
import { divineHandler, divineResult, divineTransfer, divineDeduction } from '@/utils/utils-common'
import * as http from '../interface/user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		super()
	}

	/**创建token、2小时有效期**/
	public async newJwtToken(node: User) {
		return await this.RunCatch(async i18n => {
			const expire = Number(this.configService.get('JWT_EXPIRE') ?? 7200)
			const secret = this.configService.get('JWT_SECRET')
			const token = await this.jwtService.signAsync(
				{
					id: node.id,
					uid: node.uid,
					password: node.password,
					status: node.status,
					expire: Date.now() + expire * 1000
				},
				{ secret }
			)
			return await divineResult({ expire, token })
		})
	}

	/**解析token**/
	public async untieJwtToken(token: string): Promise<User> {
		return await this.RunCatch(async i18n => {
			const secret = this.configService.get('JWT_SECRET')
			const node = await this.jwtService.verifyAsync(token, { secret })
			await divineHandler(Date.now() > node.expire, () => {
				throw new HttpException('登录已失效', HttpStatus.UNAUTHORIZED)
			})
			return await divineResult(node)
		})
	}

	/**用户配置**/
	public async httpBasicConfigur(uid: number) {
		return await this.validator({
			model: this.entity.userConfigur,
			name: '用户',
			empty: { value: true },
			options: { where: { userId: uid } }
		})
	}

	/**验证余额**/
	public async checkBalance(uid: number, value: number) {
		const { credit, balance, current } = await this.httpBasicConfigur(uid)
		await divineHandler(credit + balance < value, () => {
			throw new HttpException('余额不足', HttpStatus.BAD_REQUEST)
		})
		return await divineResult({ credit, balance, current })
	}

	/**执行扣费、写入扣费记录**/
	public async executeDeduction(
		uid: number,
		option: {
			credit: number
			balance: number
			cost: number
			name: string
			bundle: number
			type: 'captcha' | 'message' | 'email'
		}
	) {
		const { credit, balance } = await divineDeduction(option.cost, {
			credit: option.credit,
			balance: option.balance
		})
		await this.entity.userConfigur.update({ userId: uid }, { credit, balance })
		const consumer = await this.entity.userConsumer.create({
			orderId: await this.createCustomUidByte(),
			userId: uid,
			name: option.name,
			bundle: option.bundle,
			type: option.type,
			status: 'effect',
			deduct: option.cost
		})
		return await await this.entity.userConsumer.save(consumer)
	}

	/**注册用户**/
	public async httpRegister(props: http.Register) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.user.create({
				uid: await this.createCustomUidByte(),
				nickname: props.nickname,
				password: props.password
			})
			const { uid } = await await this.entity.user.save(node)
			//初始化用户配置
			const configur = await this.entity.userConfigur.create({
				userId: uid,
				authorize: 'initialize',
				balance: 0,
				credit: divineTransfer(200, { reverse: false }),
				current: divineTransfer(200, { reverse: false })
			})
			await this.entity.userConfigur.save(configur)
			return await divineResult({
				message: '注册成功'
			})
		})
	}

	/**登录**/
	public async httpAuthorize(props: http.Authorize, origin: string) {
		return await this.RunCatch(async i18n => {
			const response = await this.httpService.axiosRef.request({
				url: `https://api.lisfes.cn/api-basic/captcha/supervisor/inspector`,
				method: 'POST',
				headers: { origin },
				data: {
					appSecret: 'KB91uw5vzwpDwp5E2q3CAr67y7A7t2un',
					appKey: 'sFnFysvpL0DFGs6H',
					token: props.token,
					session: props.session
				}
			})
			await divineHandler(response.data.code !== 200, () => {
				throw new HttpException(response.data.message, HttpStatus.BAD_REQUEST)
			})
			const user = await this.validator({
				model: this.entity.user,
				name: '账号',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'status', 'password'] }
			})
			await divineHandler(!compareSync(props.password, user.password), () => {
				throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
			})
			const { token, expire } = await this.newJwtToken(user)
			return await divineResult({
				token,
				expire,
				message: '登录成功'
			})
		})
	}

	/**获取用户信息**/
	public async httpBasicAuthorize(uid: number) {
		return await this.RunCatch(async i18n => {
			const user = await this.validator({
				model: this.entity.user,
				name: '账号',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: {
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
					})
				}
			})
			const captcha = await this.entity.captchaApplication.findOne({
				where: { user, visible: 'show' }
			})
			const configur = await this.entity.userConfigur.findOne({
				where: { userId: user.uid }
			})
			return Object.assign(user, {
				appId: captcha.appId,
				appSecret: captcha.appSecret,
				authorize: configur.authorize,
				credit: configur.credit,
				balance: configur.balance
			})
		})
	}
}
