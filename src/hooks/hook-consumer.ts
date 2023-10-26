import * as _ from 'lodash'

export function useThrottle(delay: number) {
	return _.throttle(async function (handler: Function) {
		return handler()
	}, delay)
}
