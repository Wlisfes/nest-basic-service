import { HttpException, HttpStatus } from '@nestjs/common'
import { zh_CN, Faker } from '@faker-js/faker'
import { divineParameter, divineWherer, divineHandler } from '@/utils/utils-common'
import * as dayjs from 'dayjs'
import * as zlib from 'zlib'
import * as stream from 'stream'
import * as Excel from 'exceljs'

/**时间处理库**/
export const moment = dayjs

/**虚拟数据库**/
export const faker = new Faker({
	locale: [zh_CN]
})

/**条件捕获、异常抛出**/
export async function divineCatchWherer(where: boolean, option: { message: string; code?: HttpStatus }) {
	return await divineHandler(where, () => {
		throw new HttpException(option.message, option.code ?? HttpStatus.BAD_REQUEST)
	})
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
export function divineCompress(value: string): Promise<string> {
	return new Promise((resolve, reject) => {
		zlib.deflate(value, (err, buffer) => {
			if (err) {
				reject(new HttpException('压缩失败', HttpStatus.INTERNAL_SERVER_ERROR))
			} else {
				resolve(buffer.toString('base64'))
			}
		})
	})
}

/**字符串解压**/
export function divineUnzipCompr<T>(value: Buffer): Promise<T> {
	return new Promise((resolve, reject) => {
		zlib.inflate(value, (err, buffer) => {
			if (err) {
				reject(new HttpException('解压失败', HttpStatus.INTERNAL_SERVER_ERROR))
			} else {
				resolve(buffer.toString() as T)
			}
		})
	})
}

/**解析excel表格文件**/
export async function divineParsesheet(
	buffer: Excel.Buffer,
	max?: number
): Promise<{ total: number; list: Array<Record<string, string>> }> {
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
		return await divineParameter({ total: jsonData.length, list: jsonData }).then(data => {
			return divineWherer(
				max && data.total > max,
				{
					total: data.total,
					list: data.list.splice(0, max)
				},
				data
			)
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
