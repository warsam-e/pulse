import type { ElysiaWS } from 'elysia/ws';
import type { ChangeItem } from './npm';

const connections = new Map<string, ElysiaWS>();

export const ws_add = <T extends ElysiaWS>(ws: T) => connections.set(ws.id, ws);
export const ws_remove = <T extends ElysiaWS>(ws: T) => connections.delete(ws.id);

export function ws_send(item: ChangeItem) {
	for (const conn of connections.values()) conn.send(item);
}
