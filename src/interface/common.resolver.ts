import { ApiProperty } from '@nestjs/swagger'

export class NoticeResolver {
	@ApiProperty({ description: 'message', example: '接口提示' })
	message: string
}
