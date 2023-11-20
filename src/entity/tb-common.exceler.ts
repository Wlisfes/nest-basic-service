import { Entity, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TableCommon } from '@/entity/tb-common'

@Entity('tb-common_exceler')
export class TableExceler extends TableCommon {
	@ApiProperty({ description: '用户唯一UID', example: 1 })
	@IsNotEmpty({ message: 'UID 必填' })
	@Column({ comment: 'uid', update: false, nullable: false })
	uid: string

	@ApiProperty({ description: '文件ID', example: 1 })
	@IsNotEmpty({ message: '文件ID 必填' })
	@Column({ comment: '文件ID', nullable: false })
	fileId: string

	@ApiProperty({ description: '原始文件名', example: 1 })
	@IsNotEmpty({ message: '原始文件名 必填' })
	@Column({ comment: '原始文件名', nullable: false })
	fieldName: string

	@ApiProperty({ description: '文件重命名', example: 1 })
	@IsNotEmpty({ message: '文件重命名 必填' })
	@Column({ comment: '文件重命名', nullable: false })
	fileName: string

	@ApiProperty({ description: '文件地址', example: 1 })
	@IsNotEmpty({ message: '文件地址 必填' })
	@Column({ comment: '文件地址', nullable: false })
	fileURL: string

	@ApiProperty({ description: '文件后辍', example: 1 })
	@IsNotEmpty({ message: '文件后辍 必填' })
	@Column({ comment: '文件后辍', nullable: false })
	suffix: string

	@ApiProperty({ description: '文件存储路径', example: 1 })
	@IsNotEmpty({ message: '文件存储路径 必填' })
	@Column({ comment: '文件存储路径', nullable: false })
	folder: string

	@ApiProperty({ description: '文件解析列表总数', example: 1 })
	@Column({ comment: '文件解析列表总数', nullable: false, default: 0 })
	total: number
}
