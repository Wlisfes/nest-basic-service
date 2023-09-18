/**邮件服务任务队列配置**/
export const JOB_MAILER_SCHEDULE = {
	name: 'mailer:schedule',
	limiter: {
		max: 100, //仅保留最近的100个任务
		duration: 2 * 60 * 60 * 1000 //仅保留2小时内的任务
	},
	removeOnComplete: true, //任务成功后不保留在redis
	removeOnFail: false, //任务失败后保留在redis
	process: {
		schedule: 'schedule'
	}
}
