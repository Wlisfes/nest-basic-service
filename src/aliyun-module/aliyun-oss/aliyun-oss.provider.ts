import * as Client from 'ali-oss'
export const OSS_CLIENT = Symbol('OSS_CLIENT')
export const OSS_CLIENT_OPTIONS = Symbol('OSS_CLIENT_OPTIONS')

export interface OSSOptions {
	client: Client.Options
	roleArn: string
	sessionName: string
	domain?: string
}

/**OSS存储Service**/
export const ossProvider = () => ({
	provide: OSS_CLIENT,
	useFactory: (options: OSSOptions) => {
		return new Client(options.client)
	},
	inject: [OSS_CLIENT_OPTIONS]
})
