export * from './authors';
export * from './posts';
export * from './users';

export class DBError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = 'DBError';
	}
}

// biome-ignore lint/suspicious/noExplicitAny: an object where the values can be anything
export type ObjectAny = Record<string, any>;

export type Awaitable<T> = T | Promise<T>;
