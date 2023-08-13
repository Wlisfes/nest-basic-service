import { ApiOperationOptions, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'
import { ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import { ApiBearer } from '@/guard/auth.guard'
import { SwaggerOption } from '@/config/swagger-config'

interface Option {
	operation: ApiOperationOptions
	response: ApiResponseOptions
	customize: ApiResponseOptions & { title?: string }
	authorize: { login: boolean; error: boolean }
}

/**
 *
 * @param option
 * @returns
 */
export function ApiDecorator(option: Partial<Option> = {}) {
	const decorator: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
		ApiOperation(option.operation),
		ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
		ApiProduces('application/json', 'application/xml')
	]

	if (option.customize) {
		decorator.push(
			ApiResponse({
				status: option.customize.status,
				description: option.customize.description,
				schema: {
					title: option.customize.title,
					allOf: [
						{
							properties: {
								page: { type: 'number', default: 1 },
								size: { type: 'number', default: 10 },
								total: { type: 'number', default: 0 },
								list: {
									type: 'array',
									items: { $ref: getSchemaPath((option.customize as any).type) }
								}
							}
						}
					]
				}
			})
		)
	} else {
		decorator.push(ApiResponse(option.response))
	}

	if (option.authorize && option.authorize.login) {
		/**开启登录验证**/
		decorator.push(
			ApiBearerAuth(SwaggerOption.APP_AUTH_TOKEN),
			ApiBearer({
				authorize: option.authorize.login,
				error: option.authorize.error
			})
		)
	}

	return applyDecorators(...decorator)
}
