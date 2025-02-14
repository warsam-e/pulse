import { type PoolClient, insert, query, remove } from '../db';
import type { DBUser, DBUserCreate } from '../types';

export const db_users_all = (conn: PoolClient) => query<DBUser>(conn, 'SELECT * FROM users');

export const db_users_get = (id: number, conn: PoolClient) =>
	query<DBUser>(conn, 'SELECT * FROM users WHERE id = $1', [id]);

export const db_users_create = (id: number, conn: PoolClient) => insert<DBUserCreate, DBUser>(conn, 'users', { id });

export const db_users_delete = (id: number, conn: PoolClient) => remove(conn, 'users', { id }, true);
