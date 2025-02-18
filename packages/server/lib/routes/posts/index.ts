import Elysia, { t } from 'elysia';
import {
    pulsePostsAll,
    pulsePostsComment,
    pulsePostsCommentDelete,
    pulsePostsCommentLike,
    pulsePostsCommentUnlike,
    pulsePostsGet,
    pulsePostsLike,
    pulsePostsUnlike,
} from '../../core/api';
import { authResolveUser, beforeHandleAuth, cookieOpts } from '../../core/auth';
import { schemaPulsePost, schemaPulsePostCommentCreate, schemaPulsePosts } from '../../core/types';

const schemaPulseCommentGet = t.Object({
	slug: t.String(),
	id: t.Numeric(),
});

const postActionsRoutes = new Elysia()
	.resolve(async ({ cookie }) => ({ user: await authResolveUser(cookie.user) }))
	.put('/posts/:slug/like', ({ params, user }) => pulsePostsLike(params.slug, user), {
		detail: { summary: 'Like a post' },
	})
	.delete('/posts/:slug/like', ({ params, user }) => pulsePostsUnlike(params.slug, user), {
		detail: { summary: 'Unlike a post' },
	})
	.put('/posts/:slug/comment', ({ params, user, body }) => pulsePostsComment(params.slug, user, body), {
		detail: { summary: 'Comment on a post' },
		body: schemaPulsePostCommentCreate,
	})
	.delete('/posts/:slug/comment/:id', ({ params, user }) => pulsePostsCommentDelete(params.slug, user, params.id), {
		detail: { summary: 'Delete a comment on a post' },
		params: schemaPulseCommentGet,
	})
	.put('/posts/:slug/comment/:id/like', ({ params, user }) => pulsePostsCommentLike(params.slug, user, params.id), {
		detail: { summary: 'Like a comment on a post' },
		params: schemaPulseCommentGet,
	})
	.delete(
		'/posts/:slug/comment/:id/like',
		({ params, user }) => pulsePostsCommentUnlike(params.slug, user, params.id),
		{
			detail: { summary: 'Unlike a comment on a post' },
			params: schemaPulseCommentGet,
		},
	);

export default new Elysia({ tags: ['Posts'], cookie: cookieOpts })
	.get('/posts', () => pulsePostsAll(), {
		detail: { summary: 'Get all posts' },
		response: schemaPulsePosts,
	})
	.get('/posts/:slug', ({ params }) => pulsePostsGet(params.slug), {
		detail: { summary: 'Get a post by slug' },
		response: schemaPulsePost,
	})
	.guard(
		{
			beforeHandle: beforeHandleAuth,
		},
		(app) => app.use(postActionsRoutes),
	);
