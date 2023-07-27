/**延时方法**/
export function divineDelay(delay = 100, handler?: Function) {
	return new Promise(resolve => {
		const timeout = setTimeout(async () => {
			resolve(await handler?.())
			clearTimeout(timeout)
		}, delay)
	})
}

/**条件链式执行函数**/
export async function divineHandler(fn: boolean | Function, handler: Function) {
	if (typeof fn === 'function') {
		if (fn()) {
			return handler && handler()
		}
	} else if (!!fn) {
		return handler && handler()
	}
	return undefined
}
