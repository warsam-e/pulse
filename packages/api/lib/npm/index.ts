import { _npm_schema_package, npm_package } from '@warsam-e/npm';
import type { StringLike } from 'bun';
import { t } from 'elysia';
import type { ElysiaWS } from 'elysia/ws';
import Queue from 'yocto-queue';
import { get_json, try_prom } from '../utils';
import { ws_send } from '../ws';

let all: ChangeItem[] = [];

const queue = new Queue<RawChangeItem>();

let last_seq = 0;

let i = 0;

export function npm_load(ws: ElysiaWS) {
	if (!all.length) return;
	let list = all.slice(0, 100);
	for (let item of list.reverse()) if (item.seq > 0) ws.send(item);
}

export async function init_npm() {
	last_seq = await _get_first_seq();

	setInterval(check_changes, 1000);
	await check_changes();

	setInterval(check_queue, 500);
}

async function check_queue() {
	while (queue.size) {
		const item = queue.dequeue();
		if (!item) continue;

		const data = await _parse_package(item);
		all.unshift(data);
		if (all.length >= 500) all.length = 500;
		ws_send(data);
		console.log([data.name, `deleted:${data.deleted}`, data.package?.version]);
	}
}

async function check_changes() {
	const res = await _get_changes({ since: last_seq });
	if (res.last_seq === last_seq) return;
	last_seq = res.last_seq;
	for (const item of res.results) {
		queue.enqueue(item);
	}
}

export const _schema_change_item = t.Object({
	seq: t.Number(),
	time: t.String(),
	name: t.String(),
	deleted: t.Boolean(),
	package: t.Nullable(_npm_schema_package),
});
export type ChangeItem = typeof _schema_change_item.static;

async function _parse_package(item: RawChangeItem): Promise<ChangeItem> {
	const res = await try_prom(npm_package(item.id));
	return {
		seq: Date.now() + ++i,
		time: new Date().toISOString(),
		name: item.id,
		deleted: item.deleted ?? false,
		package: res ?? null,
	};
}

// changes api requests

async function _get_first_seq() {
	const res = await _get_changes({
		limit: 10,
		descending: true,
	});
	return res.last_seq - 200;
}

export type RawChangeItem = { seq: number; id: string; changes: Array<{ rev: string }>; deleted?: boolean };

export const _get_changes = (queries: Record<string, StringLike>) =>
	get_json<{
		results: Array<RawChangeItem>;
		last_seq: number;
	}>(
		`https://replicate.npmjs.com/_changes?${new URLSearchParams(Object.entries(queries).map(([k, v]) => [k, v.toString()]))}`,
	);
