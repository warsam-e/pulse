import { type Treaty, treaty } from '@elysiajs/eden';
import type { App, ChangeItem } from '@pulse/api';
import { pulse_connected, pulse_items, store_val } from '$lib/stores';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = treaty<App>('https://pulse.warsa.me');

const _get_ws = () => api.ws.subscribe();
type WS = Awaited<ReturnType<typeof _get_ws>>;
type WSMessageData = Treaty.OnMessage<ChangeItem | undefined>;

let ws: WS | undefined;

export function pulse_watch() {
	ws = api.ws.subscribe();
	ws.on('open', _handle_open);
	ws.on('close', _handle_close);
	ws.on('message', _handle_message);
	ws.on('error', _handle_error);
}

const _handle_open = () => pulse_connected.set(true);
const _handle_close = () => {
	pulse_connected.set(false);
	reconnect();
};
const _handle_message = (data: WSMessageData) => {
	const item = data.data;
	if (!item?.seq) return;
	const list = store_val(pulse_items);
	if (list.some((i) => i.seq === item?.seq)) return;
	pulse_items.set([item, ...list]);
};

const _handle_error = () => {
	if (!store_val(pulse_connected)) return;
	reconnect();
};

async function reconnect() {
	if (!ws) return;
	pulse_items.set([]);
	console.log('Reconnecting WebSocket...');
	ws.removeEventListener('error', _handle_error);
	ws.removeEventListener('message', _handle_message as (data: MessageEvent) => void);
	ws.removeEventListener('open', _handle_open);
	ws.removeEventListener('close', _handle_close);
	ws = undefined;
	await wait(1000);
	pulse_watch();
}

export type * from '@pulse/api';
