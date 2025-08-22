import { get, readable, writable, type Readable } from 'svelte/store';
import type { ChangeItem } from './api';

export const pulse_connected = writable(false);
export const pulse_items = writable<ChangeItem[]>([]);

export const store_val = <T>(store: Readable<T>) => get(store);

export const current_time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
