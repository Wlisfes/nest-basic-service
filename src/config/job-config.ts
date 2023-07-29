export const JOB_SUPERVISOR = {
	name: 'supervisor',
	expire: 300, //300秒
	event: {
		process: 'supervisor.process',
		progress: 'supervisor.progress',
		completed: 'supervisor.completed',
		failed: 'supervisor.failed',
		removed: 'supervisor.removed'
	}
}
