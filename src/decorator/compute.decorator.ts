import type { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger'
import { ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

interface Option {
	operation: ApiOperationOptions
	response: ApiResponseOptions
}

/**
 *
 * @param option
 * @returns
 */
export function ApiDecorator(option?: Option) {
	const decorator: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
		ApiOperation(option.operation),
		ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
		ApiProduces('application/json', 'application/xml'),
		ApiResponse(option.response)
	]

	return applyDecorators(...decorator)
}
