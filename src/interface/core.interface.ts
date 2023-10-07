import { Repository, FindOneOptions, FindManyOptions } from 'typeorm'

export interface CoreRequest<T> {
	name: string //模型名称
	message?: string //错误提示
	ids?: Array<number> //批量查找时id列表
	empty?: { value: boolean; message?: string } //是否验证为空
	delete?: { value: boolean; message?: string } //是否判断已删除
	close?: { value: boolean; message?: string } //是否判断已关闭
	model: Repository<T>
	options?: FindOneOptions<T>
}

export type BatchRequest<T> = {
	model: Repository<T>
	options?: FindOneOptions<T> | FindManyOptions<T>
}

export type UseResearch<T> = {
	model: Repository<T>
	options?: FindOneOptions<T>
}
