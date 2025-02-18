import Elysia, { t } from 'elysia';
import {
    pulsePostsCommentAdminDelete,
    pulsePostsCreate,
    pulsePostsDelete,
    pulsePostsUpdate,
    pulseUsersAll,
    pulseUsersDelete,
    pulseUsersUpdate,
} from '../../core/api';
import { authResolveUser } from '../../core/auth';
import { schemaPulsePostCreate, schemaPulsePostUpdate, schemaPulseUserUpdate, schemaPulseUsers } from '../../core/types';

const schemaPulseLookup = t.Object({ id: t.Numeric() });
const schemaPulseCommentLookup = t.Object({ id: t.Numeric(), commentId: t.Numeric() });

const posts = new Elysia()
	.resolve(async ({ cookie }) => ({ user: await authResolveUser(cookie.user) }))
	.put('/posts', ({ user, body }) => pulsePostsCreate(user, body), {
		detail: { summary: 'Create a post' },
		body: schemaPulsePostCreate,
	})
	.patch('/posts/:id', ({ params, body }) => pulsePostsUpdate(params.id, body), {
		detail: { summary: 'Update a post' },
		params: schemaPulseLookup,
		body: schemaPulsePostUpdate,
	})
	.delete('/posts/:id', ({ params }) => pulsePostsDelete(params.id), {
		detail: { summary: 'Delete a post' },
		params: schemaPulseLookup,
	})
	.delete(
		'/posts/:id/comments/:commentId',
		({ params }) => pulsePostsCommentAdminDelete(params.id, params.commentId),
		{
			detail: { summary: 'Delete a comment on a post' },
			params: schemaPulseCommentLookup,
		},
	);

const users = new Elysia()
	.resolve(({ cookie }) => ({ user: authResolveUser(cookie.user) }))
	.get('/users', () => pulseUsersAll(), { detail: { summary: 'Get all users' }, response: schemaPulseUsers })
	.patch('/users/:id', ({ params, body }) => pulseUsersUpdate(params.id, body), {
		detail: { summary: 'Update a user' },
		body: schemaPulseUserUpdate,
		params: schemaPulseLookup,
	})
	.delete('/users/:id', ({ params }) => pulseUsersDelete(params.id), {
		detail: { summary: 'Delete a user' },
		params: schemaPulseLookup,
	});

export default new Elysia({ prefix: '/admin', tags: ['Admin'] }).use(posts).use(users);
