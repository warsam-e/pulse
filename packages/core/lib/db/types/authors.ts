export type DBAuthorCreate = Record<'user_id', number>;

export interface DBAuthor extends DBAuthorCreate {
	created_at: Date;
}
