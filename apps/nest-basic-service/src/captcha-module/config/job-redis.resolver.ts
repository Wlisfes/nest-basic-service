export const JOB_CAPTCHA_SUPERVISOR = {
	name: 'captcha:job:supervisor',
	delay: 5 * 60 * 1000, //300秒
	removeOnComplete: true, //任务成功后不保留在redis
	removeOnFail: false, //任务失败后保留在redis
	event: {
		process: 'supervisor.process',
		progress: 'supervisor.progress',
		completed: 'supervisor.completed',
		failed: 'supervisor.failed',
		removed: 'supervisor.removed'
	}
}
