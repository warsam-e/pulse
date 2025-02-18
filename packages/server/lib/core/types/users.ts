import { t } from 'elysia';

export const schemaPulseUser = t.Object({
	id: t.Integer({ examples: [583231] }),
	isAdmin: t.Boolean({ examples: [false] }),
	isBanned: t.Boolean({ examples: [false] }),
	username: t.String({ examples: ['octocat'] }),
	name: t.Nullable(t.String({ examples: ['The Octocat'] })),
	avatar: t.String({ examples: ['https://avatars.githubusercontent.com/u/1?v=4'] }),
	followers: t.Integer({ examples: [16945] }),
	following: t.Integer({ examples: [9] }),
	location: t.Nullable(t.String({ examples: ['San Francisco'] })),
	twitterUsername: t.Nullable(t.String()),
	company: t.Nullable(t.String({ examples: ['@github'] })),
	createdAt: t.String({ format: 'date-time', examples: ['2011-01-25T18:44:36Z'] }),
	updatedAt: t.String({ format: 'date-time', examples: ['2025-01-22T12:21:20Z'] }),
});

export type PulseUser = typeof schemaPulseUser.static;

export const schemaPulseUsers = t.Array(schemaPulseUser);

export const schemaPulseUserUpdate = t.Object({
	isAdmin: t.MaybeEmpty(t.Boolean({ examples: [false] })),
	isBanned: t.MaybeEmpty(t.Boolean({ examples: [false] })),
});
export type PulseUserUpdate = typeof schemaPulseUserUpdate.static;
