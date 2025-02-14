import { type PoolClient, insert, query, remove, update } from '../db';
import type { DBPost, DBPostComment, DBPostCreate, DBPostLike, DBPostLikeCreate, DBPostUpdate } from '../types';

// MARK: - Posts
export const db_posts_all = (conn: PoolClient) => query<DBPost>(conn, 'SELECT * FROM posts');

export const db_posts_get = (id: string, conn: PoolClient) =>
	query<DBPost>(conn, 'SELECT * FROM posts WHERE id = $1', [id]);

export const db_posts_get_by_slug = (slug: string, conn: PoolClient) =>
	query<DBPost>(conn, 'SELECT * FROM posts WHERE slug = $1', [slug]);

export const db_posts_create = (data: DBPostCreate, conn: PoolClient) =>
	insert<DBPostCreate, DBPost>(conn, 'posts', data);

export const db_posts_update = (post_id: string, data: DBPostUpdate, conn: PoolClient) =>
	update<{ id: string }, DBPostUpdate, DBPost>(conn, 'posts', { id: post_id }, data);

export const db_posts_delete = (id: string, conn: PoolClient) => remove(conn, 'posts', { id }, true);

// MARK: - Post Likes
export const db_post_likes_count = (post_id: string, conn: PoolClient) =>
	query<{ count: number }>(conn, 'SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [post_id]).then(
		(res) => res[0].count,
	);

export const db_post_likes_create = (data: DBPostLikeCreate, conn: PoolClient) =>
	insert<DBPostLikeCreate, DBPostLike>(conn, 'post_likes', data);

export const db_post_likes_delete = (data: DBPostLikeCreate, conn: PoolClient) => remove(conn, 'post_likes', data);

// MARK: - Post Comments
export const db_post_comments_all = (post_id: string, conn: PoolClient) =>
	query<DBPostComment>(conn, 'SELECT * FROM post_comments WHERE post_id = $1', [post_id]);

export const db_post_comments_create = (data: DBPostComment, conn: PoolClient) =>
	insert<DBPostComment, DBPostComment>(conn, 'post_comments', data);

export const db_post_comments_update = (comment_id: string, data: DBPostComment, conn: PoolClient) =>
	update<{ id: string }, DBPostComment, DBPostComment>(conn, 'post_comments', { id: comment_id }, data);

export const db_post_comments_delete = (comment_id: string, conn: PoolClient) =>
	remove(conn, 'post_comments', { id: comment_id });

// MARK: - Post Comment Likes
export const db_post_comment_likes_count = (comment_id: string, conn: PoolClient) =>
	query<{ count: number }>(conn, 'SELECT COUNT(*) FROM post_comment_likes WHERE comment_id = $1', [comment_id]).then(
		(res) => res[0].count,
	);

export const db_post_comment_likes_create = (data: DBPostLikeCreate, conn: PoolClient) =>
	insert<DBPostLikeCreate, DBPostLike>(conn, 'post_comment_likes', data);

export const db_post_comment_likes_delete = (data: DBPostLikeCreate, conn: PoolClient) =>
	remove(conn, 'post_comment_likes', data);
