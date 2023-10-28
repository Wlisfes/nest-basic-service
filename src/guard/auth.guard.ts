import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
export const APP_AUTH_INJECT = 'APP_AUTH_INJECT'

export interface IBearer {
	authorize: boolean
	error: boolean
	baseURL?: boolean
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const bearer = this.reflector.get<IBearer>(APP_AUTH_INJECT, context.getHandler())
		const baseURL = request.route.path

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (state: IBearer) => SetMetadata(APP_AUTH_INJECT, state)
