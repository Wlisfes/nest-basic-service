/**用户信息缓存**/
export function httpCommonCacheCustomer(uid: string): string {
	return `common:cache:${uid}`
}
