export interface DBPostCreate {
	author_id: number;
	slug: string;
	title: string;
	body: string;
}

export interface DBPost extends DBPostCreate {
	id: string;
	created_at: Date;
	updated_at: Date;
}

export type DBPostUpdate = Partial<DBPostCreate> & Pick<DBPost, 'updated_at'>;

export interface DBPostLikeCreate {
	user_id: number;
	post_id: string;
}

export interface DBPostLike extends DBPostLikeCreate {
	id: string;
	created_at: Date;
}

export interface DBPostCommentCreate {
	user_id: number;
	post_id: string;
	parent_id?: string;
	body: string;
}

export interface DBPostComment extends DBPostCommentCreate {
	id: string;
	created_at: Date;
	updated_at: Date;
}

export type DBPostCommentUpdate = Partial<Pick<DBPostCommentCreate, 'body'>> & Pick<DBPostComment, 'updated_at'>;

export interface DBPostCommentLikeCreate {
	user_id: number;
	comment_id: string;
}

export interface DBPostCommentLike extends DBPostCommentLikeCreate {
	id: string;
	created_at: Date;
}
