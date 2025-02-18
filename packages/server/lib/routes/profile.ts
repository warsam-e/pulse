import Elysia from 'elysia';
import { authResolveUser, cookieOpts } from '../core/auth';
import { schemaPulseUser } from '../core/types';

export default new Elysia({ tags: ['Profile'], cookie: cookieOpts })
	.resolve(async ({ cookie }) => ({ user: await authResolveUser(cookie.user) }))
	.get('/profile', ({ user }) => user, {
		detail: { summary: 'Get user profile' },
		response: schemaPulseUser,
	});
