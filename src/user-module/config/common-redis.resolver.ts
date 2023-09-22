/**基础用户数据缓存**/
export function createUserBasicCache(uid: number | string): string {
	return `:user:basic:${uid}`
}
