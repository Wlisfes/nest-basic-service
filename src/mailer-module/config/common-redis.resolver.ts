import { isEmpty } from 'class-validator'

/**邮件应用缓存**/
export function createMailerAppCache(appId: number | string, prefix: number | string = ''): string {
	return `${prefix}:mailer:app:${appId}`
}

/**邮件模板缓存**/
export function createMailerTemplateCache(templateId: number | string, prefix: number | string = ''): string {
	return `${prefix}:mailer:template:${templateId}`
}

/**邮件任务执行队列缓存**/
export function createMailerScheduleCache(jobId: number | string = '', prefix: number | string = '') {
	const jobName = isEmpty(jobId) ? '' : `:${jobId}`
	return {
		instanceCache: `${prefix}:mailer:job:schedule:instance${jobName}`,
		executeCache: `${prefix}:mailer:job:schedule:execute${jobName}`,
		totalCache: `${prefix}:mailer:job:schedule:total${jobName}`,
		submitCache: `${prefix}:mailer:job:schedule:submit${jobName}`,
		progressCache: `${prefix}:mailer:job:schedule:progress${jobName}`,
		successCache: `${prefix}:mailer:job:schedule:success${jobName}`,
		failureCache: `${prefix}:mailer:job:schedule:failure${jobName}`
	}
}
