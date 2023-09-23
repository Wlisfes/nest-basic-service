/**邮件应用缓存**/
export function createMailerAppCache(appId: number | string): string {
	return `:mailer:app:${appId}`
}

/**邮件模板缓存**/
export function createMailerTemplateCache(templateId: number | string): string {
	return `:mailer:template:${templateId}`
}

/**邮件任务队列缓存**/
export function createScheduleCache(jobId: number) {
	return `:mailer:job:schedule:progress:${jobId}`
}
