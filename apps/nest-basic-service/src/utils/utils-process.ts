/**对象键值保留**/
export function divinePickDatePatter(data: Record<string, any>, pattern: string[], opt: Partial<{ empty: boolean }> = {}) {
	const keys = Object.keys({ ...data }).filter(key => pattern.includes(key))
	return keys.reduce((current: typeof data, key: string) => {
		current[key] = data[key]
		return current
	}, {})
}

/**对象键值去除**/
export function divineOmitDatePatter(data: Record<string, any>, pattern: string[], opt: Partial<{ empty: boolean }> = {}) {
	const keys = Object.keys({ ...data }).filter(key => !pattern.includes(key))
	return keys.reduce((current: typeof data, key: string) => {
		current[key] = data[key]
		return current
	}, {})
}
