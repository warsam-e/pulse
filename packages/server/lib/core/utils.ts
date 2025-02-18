type CookieEnv = 'COOKIE_SECRET' | 'COOKIE_DOMAIN';
type GitHubEnv = 'GITHUB_CLIENT_ID' | 'GITHUB_CLIENT_SECRET' | 'GITHUB_REDIRECT_URI';
type Env = CookieEnv | GitHubEnv | 'NODE_ENV';

export function getEnv<T extends 'string' | 'number' = 'string', V = T extends 'string' ? string : number>(
	env: Env,
	type?: T,
): V {
	const currentType = type ?? ('string' as T);
	const val = process.env[env];
	if (!val) {
		if (env === 'NODE_ENV') return 'development' as V;
		throw new Error(`Environment variable ${env} is not set`);
	}
	if (currentType === 'string') return val as V;
	const num = Number(val);
	if (Number.isNaN(num)) throw new Error(`Environment variable ${env} is not a number`);
	return num as V;
}

export const IS_PROD = getEnv('NODE_ENV') === 'production';

export class PulseError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = 'PulseError';
	}
}
