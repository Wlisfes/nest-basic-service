import { HttpException, HttpStatus } from '@nestjs/common'
import { divineHandler } from '@/utils/utils-common'

/**条件捕获、异常抛出**/
export async function divineCatchWherer(where: boolean, option: { message: string; code?: HttpStatus }) {
	return await divineHandler(where, () => {
		throw new HttpException(option.message, option.code ?? HttpStatus.BAD_REQUEST)
	})
}
