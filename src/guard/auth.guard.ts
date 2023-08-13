import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { usuCurrent } from '@/i18n'
import { UserService } from '@/user-module/user/user.service'
import { SwaggerOption } from '@/config/swagger-config'
export const APP_AUTH_INJECT = 'APP_AUTH_INJECT'

export interface IBearer {
	authorize: boolean
	error: boolean
}

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name)
	constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

	/**验证是否需要抛出异常**/
	private async AuthorizeHttpException(error: boolean, message?: string, code?: number) {
		const i18n = usuCurrent()
		if (error) {
			throw new HttpException(message ?? '登录已失效', code ?? HttpStatus.UNAUTHORIZED)
		}
		return false
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const i18n = usuCurrent()
		const request = context.switchToHttp().getRequest()
		const bearer = this.reflector.get<IBearer>(APP_AUTH_INJECT, context.getHandler())
		const baseURL = request.route.path

		//验证登录
		if (bearer && bearer.authorize) {
			const authorize = request.headers[SwaggerOption.APP_AUTH_TOKEN]
			if (!authorize) {
				//未携带token
				await this.AuthorizeHttpException(bearer.error, '未登录', HttpStatus.UNAUTHORIZED)
			} else {
				//解析token
				const user = await this.userService.untieJwtToken(authorize).catch(async e => {
					await this.AuthorizeHttpException(bearer.error, '登录已失效', HttpStatus.UNAUTHORIZED)
				})
				request.user = user
			}
			//未抛出错误、继续往下走
			return true
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (props: IBearer) => SetMetadata(APP_AUTH_INJECT, props)
