import type { Post } from '../db/models';
import { dbPostsAll, dbPostsCreate, dbPostsDelete, dbPostsGet, dbPostsGetById, dbPostsUpdate } from '../db/queries';
import type { PulsePost, PulsePostCommentCreate, PulsePostCreate, PulsePostUpdate, PulseUser } from '../types';
import { PulseError } from '../utils';
import { pulseUsersGet } from './users';

//MARK: - Lookup
async function _resolvePosts(raw: Post[]) {
	const authors = await Promise.all(raw.map((post) => pulseUsersGet(post.authorId)));

	const results: PulsePost[] = [];
	for (let i = 0; i < raw.length; i++) {
		const post = raw[i];
		const author = authors[i];

		const likes = 0;
		const comments = 0;

		results.push({
			id: post.id,
			slug: post.slug,
			title: post.title,
			content: post.content,
			isPublished: post.isPublished,
			counts: {
				likes,
				comments,
			},
			author,
			createdAt: post.createdAt.toString(),
			updatedAt: post.updatedAt.toString(),
		});
	}

	return results;
}

export async function pulsePostsAll(): Promise<PulsePost[]> {
	const posts = await dbPostsAll();
	if (!posts.length) return [];

	return _resolvePosts(posts);
}

export async function pulsePostsGet(slug: string): Promise<PulsePost> {
	const post = await dbPostsGet(slug);
	if (!post) throw new PulseError(404, 'Post not found');
	const res = await _resolvePosts([post]).then((r) => r.at(0));
	if (!res) throw new PulseError(404, 'Post not found');
	return res;
}

// MARK: - User Actions

export async function pulsePostsLike(slug: string, user: PulseUser): Promise<void> {}
export async function pulsePostsUnlike(slug: string, user: PulseUser): Promise<void> {}
export async function pulsePostsComment(slug: string, user: PulseUser, data: PulsePostCommentCreate): Promise<void> {}
export async function pulsePostsCommentDelete(slug: string, user: PulseUser, id: number): Promise<void> {}
export async function pulsePostsCommentLike(slug: string, user: PulseUser, id: number): Promise<void> {}
export async function pulsePostsCommentUnlike(slug: string, user: PulseUser, id: number): Promise<void> {}

// MARK: - Admin Actions

export const slugify = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');

export async function pulsePostsCreate(user: PulseUser, data: PulsePostCreate): Promise<PulsePost> {
	const res = await dbPostsCreate({
		authorId: user.id,
		slug: slugify(data.title),
		title: data.title,
		content: data.content,
	});
	return pulsePostsGet(res.slug);
}

export async function pulsePostsUpdate(id: number, data: PulsePostUpdate): Promise<PulsePost> {
	const res = await dbPostsUpdate(id, {
		isPublished: data.isPublished ?? undefined,
		slug: data.slug ?? undefined,
		title: data.title ?? undefined,
		content: data.content ?? undefined,
	});
	return pulsePostsGet(res.slug);
}

export async function pulsePostsDelete(id: number): Promise<void> {
	const post = await dbPostsGetById(id);
	if (!post) throw new PulseError(404, 'Post not found');
	await dbPostsDelete(id);
}

export async function pulsePostsCommentAdminDelete(id: number, commentId: number): Promise<void> {}
