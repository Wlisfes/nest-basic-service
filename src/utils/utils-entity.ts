import { isEmpty } from 'class-validator'

/**数字转换转化**/
export const customIntTransfor = {
	from: value => Number(value),
	to: value => value
}

/**字符串数组转化**/
export const StrArraytransformer = {
	from: value => {
		return isEmpty(value) ? [] : value.toString().split(',')
	},
	to: value => {
		return isEmpty(value) ? null : value.join(',')
	}
}

/**字符串转换JSON**/
export const JsonTransformer = {
	from: value => {
		return isEmpty(value) ? null : JSON.parse(value ?? '{}')
	},
	to: value => {
		return isEmpty(value) ? null : value
	}
}
