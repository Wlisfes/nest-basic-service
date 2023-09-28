/**生成N位随机整数**/
export function divineIntRandom(option: { length: number; min: number; max: number }) {
	const randomArray = Array.from({ length: option.length }, e => {
		return Math.floor(Math.random() * (option.max - option.min + 1)) + option.min
	})
	return Number(randomArray.join(''))
}

/**返回包装**/
export async function divineResult<T = { message: string; list: Array<unknown>; total: number; page: number; size: number }>(
	data: T
): Promise<T> {
	return data
}

/**条件值返回**/
export function divineWherer<T>(where: boolean, value: T, defaultValue: T = undefined): T {
	return where ? value : defaultValue
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
			return handler && (await handler())
		}
	} else if (!!fn) {
		return handler && (await handler())
	}
	return undefined
}

/**单位转换**/
export function divineTransfer(value: number, option: { reverse: boolean; scale?: number } = { reverse: true, scale: 2 }) {
	if (option.reverse) {
		const scale = Number('1'.padEnd((option.scale ?? 2) + 1, '0'))
		return parseFloat((Math.floor((value / 1000) * scale) / scale).toFixed(option.scale))
	} else {
		return parseInt((value * 1000).toFixed(0))
	}
}

export async function divineDeduction(value: number, option: { credit: number; balance: number }) {
	if (option.balance >= value) {
		const balance = option.balance - value
		return { balance, credit: option.credit }
	} else {
		const balance = option.credit + option.balance - value - option.credit
		const credit = option.credit + option.balance - value
		return { balance, credit }
	}
}
