import swagger from '@elysiajs/swagger';

export const swagger_conf = swagger({
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
	scalarVersion: '1.25.9',
	scalarConfig: {
		theme: 'alternate',
		layout: 'classic',
	},
	path: '/docs',
	exclude: ['/', /^\/docs.*/],
	excludeStaticFile: false,
});
