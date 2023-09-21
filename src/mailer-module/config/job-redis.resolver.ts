/**邮件服务任务队列配置**/
export const JOB_MAILER_SCHEDULE = {
	name: 'mailer:job:schedule',
	removeOnComplete: true, //任务成功后不保留在redis
	removeOnFail: false, //任务失败后保留在redis
	process: {
		schedule: 'schedule'
	}
}

/**邮件服务执行队列配置**/
export const JOB_MAILER_EXECUTE = {
	name: 'mailer:job:execute',
	removeOnComplete: true, //任务成功后不保留在redis
	removeOnFail: false, //任务失败后保留在redis
	process: {
		execute: 'execute'
	}
}
