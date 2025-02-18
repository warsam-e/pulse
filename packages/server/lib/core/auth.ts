import { type Cookie, type CookieOptions, t } from 'elysia';
import { pulseUsersGet } from './api';
import { gitHubAuthUser } from './api/octo';
import type { PulseUser } from './types';
import { PulseError, getEnv } from './utils';

export const cookieOpts: CookieOptions & { sign: ['user', 'redirectTo'] } = {
	secrets: getEnv('COOKIE_SECRET', 'string'),
	domain: getEnv('COOKIE_DOMAIN', 'string'),
	sign: ['user', 'redirectTo'],
};

export const schemaAuthCookie = t.Cookie({
	user: t.Optional(t.Number()),
	redirectTo: t.Optional(t.String()),
});

export function authValidateCookie<T>(cookie: Cookie<T>) {
	const id = Number.parseInt(cookie.value as string);
	console.log('authValidateCookie', !Number.isNaN(id));
	return !Number.isNaN(id);
}
export async function authResolveUser<T>(cookie: Cookie<T>) {
	const id = Number.parseInt(cookie.value as string);
	return pulseUsersGet(id);
}

export async function resolveTokenUser(token: string) {
	const res = await gitHubAuthUser(token);
	if (res.status !== 200) return;
	return pulseUsersGet(res.data.id);
}

export async function beforeHandleAuth({ cookie }: { cookie: Record<string, Cookie<string | undefined>> }) {
	if (!authValidateCookie(cookie.user)) throw new PulseError(401, 'Authentication required');
}

export async function beforeHandleAdmin({ user }: { user: PulseUser }) {
	if (!user.isAdmin) throw new PulseError(403, 'Admin required');
}
