export type EventType = string | symbol
export type Handler<T = unknown> = (event?: T) => void
export type HandlerList<T = unknown> = Array<Handler<T>>
export type HandlerMap<Event extends Record<EventType, unknown>> = Map<
	keyof Event | string,
	HandlerList<Event[keyof Event]>
>

export class Observer<Event extends Record<EventType, unknown>> {
	private listener: HandlerMap<Event>
	constructor() {
		this.listener = new Map()
	}

	public emit<Key extends keyof Event>(type: Key, parameter?: Event[keyof Event]) {
		const handlers = this.listener.get(type)
		if (handlers && handlers.length > 0) {
			handlers.map(handler => {
				handler(parameter)
			})
		}
	}

	public once<Key extends keyof Event>(type: Key, handler: Handler<Event[keyof Event]>) {
		const done = this.on(type, parameter => {
			handler(parameter)
			done()
		})
	}

	public on<Key extends keyof Event>(type: Key, handler: Handler<Event[keyof Event]>) {
		const handlers = this.listener.get(type)
		if (handlers) {
			handlers.push(handler)
		} else {
			this.listener.set(type, [handler])
		}
		return () => {
			this.off(type, handler)
		}
	}

	public off<Key extends keyof Event>(type: Key, handler?: Handler<Event[keyof Event]>) {
		const handlers = this.listener.get(type)
		if (handlers) {
			if (handler) {
				handlers.splice(handlers.indexOf(handler) >>> 0, 1)
			} else {
				this.listener.set(type, [])
			}
		}
	}

	public clear(): void {
		return this.listener.clear()
	}
}
