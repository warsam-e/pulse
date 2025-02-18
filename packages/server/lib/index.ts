import cors from '@elysiajs/cors';
import Elysia, { ValidationError } from 'elysia';
import { SWAGGER_CONF } from './config';
import { PulseError } from './core/utils';
import routes from './routes';

const API_PORT = 3000;

const app = new Elysia()
	.onError(({ error, set }) => {
		if (error instanceof PulseError) {
			set.status = error.status;
			return { error: error.message };
		}
		set.status = 500;
		console.error(error);
		if (error instanceof ValidationError) return { error: JSON.parse(error.message).summary };
		if (error instanceof Error) return { error: error.message };
		return { error };
	})
	.use(cors())
	.use(SWAGGER_CONF)
	.get('/', ({ redirect }) => redirect('/docs'))
	.use(routes)
	.listen(API_PORT, () => console.log(`API listening on port ${API_PORT}`));

// to be used with @elysiajs/eden on the frontend
export type App = typeof app;
