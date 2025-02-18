import Elysia from 'elysia';
import { authResolveUser, beforeHandleAdmin, beforeHandleAuth, cookieOpts } from '../core/auth';
import admin from './admin';
import auth from './auth';
import posts from './posts';
import profile from './profile';

export default new Elysia({ tags: ['API'], cookie: cookieOpts })
	.use(posts)
	.use(auth)
	.guard({ beforeHandle: beforeHandleAuth }, (app) =>
		app
			.use(profile)
			.resolve(async ({ cookie }) => ({ user: await authResolveUser(cookie.user) }))
			.guard({ beforeHandle: beforeHandleAdmin }, (app) => app.use(admin)),
	);
