import { isEmpty } from 'class-validator'

/**邮件应用缓存**/
export function createMailerAppCache(appId: number | string): string {
	return `:mailer:app:${appId}`
}

/**邮件模板缓存**/
export function createMailerTemplateCache(templateId: number | string): string {
	return `:mailer:template:${templateId}`
}

/**邮件任务执行队列缓存**/
export function createMailerScheduleCache(jobId: number | string = '') {
	const jobName = isEmpty(jobId) ? '' : `:${jobId}`
	return {
		instanceCache: `mailer:job:execute:instance${jobName}`,
		totalCache: `:mailer:job:schedule:total${jobName}`,
		submitCache: `:mailer:job:schedule:submit${jobName}`,
		progressCache: `:mailer:job:schedule:progress${jobName}`,
		successCache: `:mailer:job:schedule:success${jobName}`,
		failureCache: `:mailer:job:schedule:failure${jobName}`
	}
}
