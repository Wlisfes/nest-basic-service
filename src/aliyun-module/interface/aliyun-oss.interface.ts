import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class OSSUploadFile {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty({ message: 'file文件不能为空' })
	file: any
}

export class OSSUploadFiles {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty({ message: 'files文件不能为空' })
	files: any
}
