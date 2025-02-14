import cors from '@elysiajs/cors';
import Elysia from 'elysia';
import routes from './routes';

const API_PORT = 3000;

const app = new Elysia()
	.use(cors())
	.get('/', ({ redirect }) => redirect('/docs'))
	.use(routes)
	.listen(API_PORT, () => console.log(`API listening on port ${API_PORT}`));

// to be used with @elysiajs/eden on the frontend
export type App = typeof app;
