import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { RequestResolver } from '@/interface/common.resolver'

/**文件上传**/
export class CreateUploadExceler {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty({ message: 'file文件不能为空' })
	file: unknown
}

/**文件列表**/
export class ColumnStorageExceler extends PickType(RequestResolver, ['page', 'size']) {}
