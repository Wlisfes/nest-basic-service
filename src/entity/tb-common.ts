import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import * as day from 'dayjs'

export class TableCommon {
	@ApiProperty({ description: '自增长主键ID', example: 1 })
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	keyId: number

	@ApiProperty({ description: '创建时间', example: '2023-10-26 16:03:38' })
	@CreateDateColumn({
		comment: '创建时间',
		update: false,
		transformer: {
			from: value => day(value).format('YYYY-MM-DD HH:mm:ss'),
			to: value => value
		}
	})
	createTime: Date

	@ApiProperty({ description: '更新时间', example: '2023-10-26 16:03:38' })
	@UpdateDateColumn({
		comment: '更新时间',
		transformer: {
			from: value => day(value).format('YYYY-MM-DD HH:mm:ss'),
			to: value => value
		}
	})
	updateTime: Date
}
