/**生成N位随机整数字符串**/
export async function divineIntNumber(pad: number = 18) {
	const flake = [Math.floor(Date.now() / 1000).toString()]
	const length = Math.ceil((pad - 10) / 16) + 1
	const random = Array.from({ length }, e => Math.random().toString().slice(2))
	return flake.concat(random).join('').slice(0, pad)
}

/**生成N位随机符串**/
export async function divineIntStringer(
	pad: number = 18,
	character: string = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
) {
	return Array.from({ length: pad }, e => character.charAt(Math.floor(Math.random() * character.length))).join('')
}

/**返回包装**/
export async function divineResult<T = { message: string; list: Array<unknown>; total: number; page: number; size: number }>(
	data: T
): Promise<T> {
	return data
}

/**计算定时发送时间**/
export async function divineDateDelay(date: Date | string) {
	const currTime = new Date()
	const sendTime = new Date(date ?? currTime)
	const reduce = sendTime.getTime() - currTime.getTime()
	const delay = reduce > 0 ? reduce : 0
	return { currTime, sendTime, reduce, delay }
}

/**参数组合**/
export async function divineParameter<T>(data: T) {
	return data
}

/**条件值返回**/
export async function divineWherer<T>(where: boolean, value: T, defaultValue: T = undefined): Promise<T> {
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
export async function divineHandler(where: boolean | Function, handler: Function) {
	if (typeof where === 'function') {
		const value = where()
		return value && handler ? await handler() : undefined
	} else if (Boolean(where)) {
		return handler ? await handler() : undefined
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
