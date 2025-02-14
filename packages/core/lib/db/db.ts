import { join } from 'node:path';
import { Client, Pool, type PoolClient, type QueryResult } from 'pg';
import { DBError, type ObjectAny } from './types';

declare module 'pg' {
	interface ClientBase {
		[Symbol.dispose](): void;
	}
}

Client.prototype[Symbol.dispose] = function () {
	if ('release' in this) (this as PoolClient).release(true);
};

export const pool = new Pool({
	host: 'pulse_db',
	port: 5432,
	database: 'pulse',
	user: 'pulse',
	password: 'pulse',
});
export type { PoolClient } from 'pg';

pool.on('connect', () => console.log(`Connected to db: ${pool.totalCount}`));
pool.on('remove', () => console.log(`Removed db connection: ${pool.totalCount}`));

const proj_root = join(import.meta.url.replace('file://', ''), '../../../../..');
const init_script = await Bun.file(join(proj_root, 'assets/init.psql')).text();

async function init_pool() {
	console.time('[Pulse DB] Init');
	using conn = await pool.connect();
	await query(conn, init_script);
	console.timeEnd('[Pulse DB] Init');
}

await init_pool();

export async function query<T extends ObjectAny, V = unknown>(
	conn: PoolClient,
	query: string,
	values: Array<V> = [],
): Promise<T[]> {
	let res: QueryResult<T>;
	try {
		res = await conn.query<T, typeof values>(query, values);
	} catch (e) {
		console.error(e);
		throw new DBError(
			500,
			`${e instanceof Error ? e.message : 'unknown error'}. ${
				'position' in (e as Record<string, unknown>)
					? `Error at position ${(e as Record<string, unknown>).position}`
					: ''
			}`,
		);
	}
	return res.rows;
}

export async function insert<T extends ObjectAny, V extends ObjectAny>(
	conn: PoolClient,
	table: string,
	data: T,
	conflict?: Array<keyof T>,
): Promise<V> {
	const keys = Object.keys(data);
	const values = Object.values(data);
	if (conflict?.length) {
		values.push(...Object.keys(data).map((k) => data[k]));
	}
	const res = await query<V>(
		conn,
		`insert into ${table} (${keys.join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) ${
			conflict?.length
				? `on conflict (${conflict.join(', ')}) do update set ${Object.keys(data)
						.map((k, i) => `${k} = $${i + 1 + keys.length}`)
						.join(', ')}`
				: ''
		} returning *`,
		values,
	);

	if (!res[0]) throw new DBError(500, 'No result');

	return res[0];
}

export async function update<T extends ObjectAny, Data extends ObjectAny, V extends ObjectAny>(
	conn: PoolClient,
	table: string,
	where: {
		[K in keyof T]: T[K];
	},
	data: Data,
): Promise<V> {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const where_keys = Object.keys(where);
	const where_values = Object.values(where);
	const res = await query<V>(
		conn,
		`update ${table} set ${keys.map((k, i) => `${k} = $${i + 1}`).join(', ')} where ${where_keys
			.map((k, i) => `${k} = $${i + 1 + keys.length}`)
			.join(' and ')} returning *`,
		[...values, ...where_values],
	);

	if (!res[0]) throw new DBError(500, 'No result');

	return res[0];
}

export async function remove<T extends ObjectAny>(
	conn: PoolClient,
	table: string,
	where: {
		[K in keyof T]?: T[K];
	},
	cascade = false,
): Promise<void> {
	const keys = Object.keys(where);
	const values = Object.values(where);
	await query(
		conn,
		`delete from ${table} where ${keys.map((k, i) => `${k} = $${i + 1}`).join(' and ')}${cascade ? ' cascade' : ''}`,
		values,
	);
}
