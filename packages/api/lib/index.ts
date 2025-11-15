import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { _schema_change_item, init_npm, npm_load } from './npm';
import { IS_PROD } from './utils';
import { ws_add, ws_remove } from './ws';

const port = IS_PROD ? 3000 : 3984;

await init_npm();

const app = new Elysia()
	.use(
		cors({
			origin: /.*\.warsa\.me$/,
		}),
	)
	.get('/', { message: 'Pulse API' })
	.get('/health', { status: 'ok' })
	.ws('/ws', {
		response: _schema_change_item,
		open(ws) {
			ws_add(ws);
			npm_load(ws);
		},
		close(ws) {
			ws_remove(ws);
		},
	})
	.listen(port, () => console.log(`Live at port ${port}`));

export type App = typeof app;

export type * from './npm';
