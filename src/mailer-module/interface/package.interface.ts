import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class MailerPackage extends PickType(Request, ['id']) {
	@ApiProperty({ description: '套餐 ID', example: 1692282099925375 })
	@IsNotEmpty({ message: '套餐 必填' })
	@Type(type => Number)
	bundle: number

	@ApiProperty({ description: '套餐名称', example: '套餐名称' })
	@IsNotEmpty({ message: '套餐名称 必填' })
	name: string

	@ApiProperty({ description: '套餐类型：small-小额套餐、large-大额套餐', example: 'small' })
	@IsNotEmpty({ message: '套餐类型 必填' })
	type: string

	@ApiProperty({ description: '套餐备注', required: false })
	@IsOptional()
	comment: string

	@ApiProperty({ description: '套餐有效期', example: 1 })
	@IsNotEmpty({ message: '套餐有效期 必填' })
	@IsNumber({}, { message: '套餐有效期必须为1~36' })
	@Min(1)
	@Max(36)
	@Type(type => Number)
	expire: number

	@ApiProperty({ description: '套餐总数', example: 1000 })
	@IsNotEmpty({ message: '套餐总数 必填' })
	@IsNumber({}, { message: '套餐总数必须为数字' })
	@Min(1)
	@Type(type => Number)
	total: number

	@ApiProperty({ description: '套餐发行数量', example: 1000 })
	@IsNotEmpty({ message: '套餐发行数量 必填' })
	@IsNumber({}, { message: '套餐发行数量必须为数字' })
	@Min(1)
	@Type(type => Number)
	stock: number

	@ApiProperty({ description: '套餐剩余数量', example: 1000 })
	@IsNotEmpty({ message: '套餐剩余数量 必填' })
	@IsNumber({}, { message: '套餐剩余数量必须为数字' })
	@Min(1)
	@Type(type => Number)
	surplus: number

	@ApiProperty({ description: '套餐最大购买数量', example: 0, default: 0 })
	@IsNotEmpty({ message: '套餐最大购买数量 必填' })
	@Min(0)
	@Type(type => Number)
	max: number

	@ApiProperty({ description: '套餐价格', example: 1000, default: 0 })
	@IsNotEmpty({ message: '套餐价格 必填' })
	@IsNumber({}, { message: '套餐价格必须为数字' })
	@Min(0)
	@Type(type => Number)
	price: number

	@ApiProperty({ description: '套餐折扣', example: 1000, default: 0 })
	@IsNotEmpty({ message: '套餐折扣 必填' })
	@IsNumber({}, { message: '套餐折扣必须为数字' })
	@Min(0)
	@Type(type => Number)
	discount: number

	@ApiProperty({ description: '套餐标签', required: false })
	@IsOptional()
	label: string

	@ApiProperty({
		description: '状态: 待生效-pending、已上架-upper、已下架-under、已过期-expired、已售罄-soldout、已删除-delete',
		example: 'pending',
		default: 'pending'
	})
	@IsNotEmpty({ message: '套餐名称 必填' })
	@Type(type => String)
	status: string
}

export class CreateMailerPackage extends IntersectionType(
	PickType(MailerPackage, ['name', 'type', 'comment', 'expire', 'total', 'stock', 'surplus']),
	PickType(MailerPackage, ['max', 'price', 'discount', 'label'])
) {}

export class ColumnMailerPackage extends PickType(Request, ['page', 'size']) {}

export class MailerPackageSubscriber extends PickType(MailerPackage, ['bundle']) {}
