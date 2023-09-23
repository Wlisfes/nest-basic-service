import * as dayjs from 'dayjs'
import * as zlib from 'zlib'
export const moment = dayjs

/**字符串压缩**/
export function divineCompress(value: string): Promise<string> {
	return new Promise((resolve, reject) => {
		zlib.deflate(value, (err, buffer) => {
			if (err) {
				console.error('压缩失败:', err)
				reject('压缩失败')
			} else {
				resolve(buffer.toString('base64'))
			}
		})
	})
}

/**字符串解压**/
export function divineUnzipCompr(value: Buffer) {
	return new Promise((resolve, reject) => {
		zlib.inflate(value, (err, buffer) => {
			if (err) {
				console.error('解压失败:', err)
				reject('解压失败')
			} else {
				resolve(buffer.toString())
			}
		})
	})
}

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

/**邮件模板JSON转换**/
export function divineJsonTransfer(data: Record<string, any>) {
	return {
		attributes: data.attributes ?? {},
		tagName: data.tagName ?? '',
		content: data.content ?? '',
		children: (data.children ?? []).map(item => divineJsonTransfer(item))
	}
}
