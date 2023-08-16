import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { HttpService } from '@nestjs/axios'
import { compareSync } from 'bcryptjs'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { User } from '@/entity/tb-user.entity'
import { divineHandler } from '@/utils/utils-common'
import * as http from '../interface/user.interface'
import * as uuid from 'uuid'

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

	/**创建token、2小时有效期**/ //prettier-ignore
	public async newJwtToken(node: User) {
		return await this.RunCatch(async i18n => {
			const expire = Number(this.configService.get('JWT_EXPIRE') ?? 7200)
			const secret = this.configService.get('JWT_SECRET')
			return await this.jwtService.signAsync(
				{
					id: node.id,
					uid: node.uid,
					password: node.password,
					status: node.status,
					expire: Date.now() + expire * 1000 
				}, { secret }).then(token => {
					return { expire, token }
			})
		})
	}

	/**解析token**/
	public async untieJwtToken(token: string): Promise<User> {
		return await this.RunCatch(async i18n => {
			const secret = this.configService.get('JWT_SECRET')
			const node = await this.jwtService.verifyAsync(token, { secret })
			return await divineHandler(Date.now() > node.expire, () => {
				throw new HttpException('登录已失效', HttpStatus.UNAUTHORIZED)
			}).then(() => {
				return node
			})
		})
	}

	/**注册用户**/
	public async httpRegister(props: http.Register) {
		return await this.RunCatch(async i18n => {
			const random = (await this.createRandom(11111, 99999)).toString()
			const node = await this.entity.user.create({
				uid: Number(Date.now() + random),
				nickname: props.nickname,
				password: props.password
			})
			return await this.entity.user.save(node).then(async () => {
				return { message: '注册成功' }
			})
		})
	}

	/**登录**/ //prettier-ignore
	public async httpAuthorize(props: http.Authorize, origin: string) {
		return await this.RunCatch(async i18n => {
			await this.httpService.axiosRef.request({
				url: `https://api.lisfes.cn/api-basic/captcha/supervisor/inspector`,
				method: 'POST',
				headers: { origin },
				data: {
					appSecret: 'KB91uw5vzwpDwp5E2q3CAr67y7A7t2un',
					appKey: 'sFnFysvpL0DFGs6H',
					token: props.token,
					session: props.session
				}
			}).then(async ({ data }) => {
				return await divineHandler(data.code !== 200, () => {
						throw new HttpException(data.message, HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			return await this.validator({
				model: this.entity.user,
				name: '账号',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'status', 'password'] }
			}).then(async data => {
				await divineHandler(() => !compareSync(props.password, data.password), () => {
						throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
					}
				)
				return await this.newJwtToken(data).then(({ token, expire }) => {
					return { token, expire, message: '登录成功' }
				})
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
			const captcha = await this.entity.captchaApplication.findOne({ where: { user, visible: 'show' } })

			return Object.assign(user, {
				appKey: captcha.appKey,
				appSecret: captcha.appSecret
			})
		})
	}
}
