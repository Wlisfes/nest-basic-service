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
