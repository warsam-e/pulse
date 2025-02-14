export type DBUserCreate = Record<'id', number>;

export interface DBUser extends DBUserCreate {
	created_at: Date;
}
