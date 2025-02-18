import { t } from 'elysia';
import { schemaPulseUser } from './users';

export const schemaPulsePost = t.Object({
	id: t.Integer({ examples: [1] }),
	slug: t.String({ examples: ['hello-world'] }),
	title: t.String({ examples: ['Hello, World!'] }),
	content: t.String({ examples: ['Hello, World!'] }),
	isPublished: t.Boolean({ examples: [true] }),
	counts: t.Object({
		likes: t.Integer({ examples: [0] }),
		comments: t.Integer({ examples: [0] }),
	}),
	author: schemaPulseUser,
	createdAt: t.String({ format: 'date-time', examples: [new Date('2025-01-01').toString()] }),
	updatedAt: t.String({ format: 'date-time', examples: [new Date('2025-02-01').toString()] }),
});

export type PulsePost = typeof schemaPulsePost.static;

export const schemaPulsePosts = t.Array(schemaPulsePost);

export const schemaPulsePostCreate = t.Object({
	title: t.String({ examples: ['Hello, World!'] }),
	content: t.String({ examples: ['Hello, World!'] }),
});
export type PulsePostCreate = typeof schemaPulsePostCreate.static;

export const schemaPulsePostUpdate = t.Object({
	isPublished: t.MaybeEmpty(t.Boolean({ examples: [true] })),
	slug: t.MaybeEmpty(t.String({ examples: ['hello-world'] })),
	title: t.MaybeEmpty(t.String({ examples: ['Hello, World!'] })),
	content: t.MaybeEmpty(t.String({ examples: ['Hello, World!'] })),
});
export type PulsePostUpdate = typeof schemaPulsePostUpdate.static;

export const schemaPulsePostCommentCreate = t.Object({
	title: t.String({ examples: ['Hello, World!'] }),
	content: t.String({ examples: ['Hello, World!'] }),
});
export type PulsePostCommentCreate = typeof schemaPulsePostCommentCreate.static;
