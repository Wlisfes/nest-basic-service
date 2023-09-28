import * as dayjs from 'dayjs'
import * as zlib from 'zlib'
import * as Excel from 'exceljs'
import { zh_CN, Faker } from '@faker-js/faker'

/**时间处理库**/
export const moment = dayjs

/**虚拟数据库**/
export const faker = new Faker({
	locale: [zh_CN]
})

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

/**解析excel表格文件**/
export function divineParsesheet(buffer: Excel.Buffer, max?: number): Promise<{ total: number; list: Array<Record<string, string>> }> {
	return new Promise(async (resolve, reject) => {
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
			resolve({ total: jsonData.length, list: jsonData })
			// if (max && max < jsonData.length) {
			// 	resolve({
			// 		total: jsonData.length,
			// 		list: jsonData.splice(0, max)
			// 	})
			// } else {
			// 	resolve({ total: jsonData.length, list: jsonData })
			// }
		} catch (e) {
			reject('文件解析失败')
		}
	})
}

/**JSON转化成xlsx文件**/
export function divineWritesheet(jsonData: Array<Record<string, any>>, option: { columns: Array<Partial<Excel.Column>> }): Promise<Buffer> {
	return new Promise(async (resolve, rejcet) => {
		try {
			const excel = new Excel.Workbook()
			const sheet = excel.addWorksheet('Sheet1')
			sheet.columns = option.columns ?? []
			sheet.addRows(jsonData)
			const buffer = await excel.xlsx.writeBuffer()
			resolve(buffer as Buffer)
		} catch (e) {
			rejcet('JSON转换失败')
		}
	})
}
