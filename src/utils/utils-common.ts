/**返回包装**/
export async function divineResult<
	T = {
		message: string
		list: Array<unknown>
		total: number
		page: number
		size: number
	}
>(data: T): Promise<T> {
	return data
}

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

/**单位转换**/
export function divineTransfer(value: number, option: { reverse: boolean; scale?: number } = { reverse: true, scale: 2 }) {
	if (option.reverse) {
		const scale = Number('1'.padEnd((option.scale ?? 2) + 1, '0'))
		return (Math.floor((value / 1000) * scale) / scale).toFixed(option.scale)
	} else {
		return (value * 1000).toFixed(0)
	}
}
