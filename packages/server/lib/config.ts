import swagger from '@elysiajs/swagger';

export const SWAGGER_CONF = swagger({
	documentation: {
		info: {
			title: 'Pulse API',
			description:
				'This is the API documentation for the Pulse API. This is mainly used by the Pulse frontend to fetch posts, authenticate users, and more.',
			version: '1.0.0',
			contact: {
				name: 'Warsame Egeh',
				url: 'https://warsame.me',
			},
		},
	},
	scalarConfig: {
		layout: 'classic',
		defaultHttpClient: {
			targetKey: 'javascript',
			clientKey: 'fetch',
		},
	},
	scalarVersion: '1.25.9',
	path: '/docs',
	exclude: ['/', /^\/docs.*/],
	excludeStaticFile: false,
});
