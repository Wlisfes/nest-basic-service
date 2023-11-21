import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUploadExceler {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty({ message: 'file文件不能为空' })
	file: unknown
}
