import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CustomProvider } from '@/utils/utils-configer'
import { divineParseJwtToken } from '@/utils/utils-plugin'
import { divineHandler } from '@/utils/utils-common'

export interface IOption {
	authorize: boolean
	error: boolean
	baseURL?: boolean
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	public async httpContextAuthorize(error: boolean, { message, code }: Partial<{ message: string; code: number }>) {
		if (error) {
			throw new HttpException(message ?? '登录已失效', code ?? HttpStatus.UNAUTHORIZED)
		}
		return false
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const state = this.reflector.get<IOption>(`APP_AUTH_INJECT`, context.getHandler())
		const baseURL = request.route.path

		/**验证登录**/
		if (state && state.authorize) {
			const configer = CustomProvider()
			const token = request.headers[configer.jwt.name]
			if (!token) {
				//未携带token
				await this.httpContextAuthorize(state.error, { message: '未登录' })
			} else {
				/**解析token**/ //prettier-ignore
				const node = await divineParseJwtToken(token, { secret: configer.jwt.secret }).then(async data => {
					await divineHandler(data.status === 'disable', () => {
						return this.httpContextAuthorize(state.error, { message: '账户已被禁用', code: HttpStatus.FORBIDDEN })
					})
					return data
				}).catch(async e => {
					await this.httpContextAuthorize(state.error, { message: '登录已失效' })
				})
				request.user = node
			}
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (state: IOption) => SetMetadata(`APP_AUTH_INJECT`, state)
