import { HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmail } from 'class-validator'
import { zh_CN, Faker } from '@faker-js/faker'
import { divineParameter, divineHandler } from '@/utils/utils-common'
import * as dayjs from 'dayjs'
import * as crypto from 'crypto'
import * as LZString from 'lz-string'
import * as stream from 'stream'
import * as Excel from 'exceljs'

/**JWT实例**/
export const jwt = new JwtService()

/**时间处理库**/
export const moment = dayjs

/**虚拟数据库**/
export const faker = new Faker({
	locale: [zh_CN]
})

/**条件捕获、异常抛出**/
export async function divineCatchWherer(where: boolean, option: { message: string; code?: number }) {
	return await divineHandler(where, () => {
		throw new HttpException(option.message, option.code ?? HttpStatus.BAD_REQUEST)
	})
}

/**创建用户JWT Token**/
export async function divineCreateJwtToken(option: {
	expire: number
	secret: string
	data: Record<string, any>
	message?: string
	code?: number
}) {
	try {
		const token = await jwt.signAsync({ ...option.data, expire: Date.now() + option.expire * 1000 }, { secret: option.secret })
		return { token, expire: option.expire }
	} catch (e) {
		throw new HttpException(option.message ?? 'JWT创建失败', option.code ?? HttpStatus.UNAUTHORIZED)
	}
}

/**解析用户JWT Token***/
export async function divineParseJwtToken<T>(token: string, option: { secret: string; message?: string; code?: number }) {
	try {
		return await jwt.verifyAsync(token, { secret: option.secret })
	} catch (e) {
		throw new HttpException(option.message ?? 'JWT解析失败', option.code ?? HttpStatus.UNAUTHORIZED)
	}
}

/**Buffer转换Stream**/
export function divineBufferToStream(buffer: Buffer): Promise<stream.PassThrough> {
	return new Promise(resolve => {
		const fileStream = new stream.PassThrough()
		fileStream.end(buffer)
		return resolve(fileStream)
	})
}

/**Stream转换Buffer**/
export function divineStreamToBuffer(streamFile): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		let buffers = []
		streamFile.on('error', reject)
		streamFile.on('data', data => buffers.push(data))
		streamFile.on('end', () => resolve(Buffer.concat(buffers)))
	})
}

/**字符串压缩**/
export async function divineCompress(value: string): Promise<string> {
	try {
		return LZString.compressToBase64(value)
	} catch (e) {
		throw new HttpException('压缩失败', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}

/**字符串解压**/
export async function divineUnzipCompr<T extends string>(value: T): Promise<T> {
	try {
		return LZString.decompressFromBase64(value) as T
	} catch (e) {
		throw new HttpException('解压失败', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}

/**解析excel表格文件**/
export async function divineParsesheet(
	buffer: Excel.Buffer,
	max?: number
): Promise<{ header: boolean; total: number; list: Array<Record<string, string>> }> {
	try {
		const excel = new Excel.Workbook()
		await excel.xlsx.load(buffer)
		const sheet = excel.getWorksheet(1)
		const jsonData: Array<Record<string, string>> = []
		sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
			const rowData: Record<string, string> = {}
			row.eachCell((cell: any, colNumber) => {
				rowData[`COLUMN_${colNumber}`] = cell.value.text ?? cell.value
			})
			jsonData.push(rowData)
		})
		return await divineParameter({
			header: jsonData.length > 0 && !isEmail(jsonData[0].COLUMN_),
			total: jsonData.length,
			list: jsonData
		}).then(data => {
			if (max && data.total > max) {
				return { ...data, list: data.list.splice(0, max) }
			}
			return data
		})
	} catch (e) {
		throw new HttpException('文件解析失败', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}

/**JSON转化成xlsx文件**/
export async function divineWritesheet(
	jsonData: Array<Record<string, any>>,
	option: { columns: Array<Partial<Excel.Column>> }
): Promise<Buffer> {
	try {
		const excel = new Excel.Workbook()
		const sheet = excel.addWorksheet('Sheet1')
		sheet.columns = option.columns ?? []
		sheet.addRows(jsonData)
		return (await excel.xlsx.writeBuffer()) as Buffer
	} catch (e) {
		throw new HttpException('JSON转换失败', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}
