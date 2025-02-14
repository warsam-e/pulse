import { type PoolClient, insert, query, remove } from '../db';
import type { DBAuthor, DBAuthorCreate } from '../types';

export const db_authors_all = (conn: PoolClient) => query<DBAuthor>(conn, 'SELECT * FROM authors');

export const db_authors_exists = (user_id: number, conn: PoolClient) =>
	query<DBAuthor>(conn, 'SELECT * FROM authors WHERE user_id = $1', [user_id]).then(
		(res) => res.at(0)?.user_id === user_id,
	);

export const db_authors_create = (user_id: number, conn: PoolClient) =>
	insert<DBAuthorCreate, DBAuthor>(conn, 'authors', { user_id });

export const db_authrs_delete = (user_id: number, conn: PoolClient) => remove(conn, 'authors', { user_id });
