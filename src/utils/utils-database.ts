import { isEmpty } from 'class-validator'

/**字符串分割**/
export function divineSplitTransformer(value: string) {
	return isEmpty(value) ? [] : value.toString().split(',')
}

/**数组Join**/
export function divineJoinTransformer(value: Array<string>) {
	return isEmpty(value) ? null : value.join(',')
}
