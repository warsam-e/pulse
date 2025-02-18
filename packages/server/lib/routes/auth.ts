import Elysia, { error, t } from 'elysia';
import { oauth2 } from 'elysia-oauth2';
import { authResolveUser, cookieOpts, resolveTokenUser, schemaAuthCookie } from '../core/auth';
import { getEnv } from '../core/utils';

export default new Elysia({ prefix: '/auth', tags: ['Auth'], cookie: cookieOpts })
	.use(
		oauth2({
			// biome-ignore lint/style/useNamingConvention: required by the library
			GitHub: [getEnv('GITHUB_CLIENT_ID'), getEnv('GITHUB_CLIENT_SECRET'), getEnv('GITHUB_REDIRECT_URI')],
		}),
	)
	.onBeforeHandle(async ({ cookie, redirect, path }) => {
		const skipRoute = !['login', 'callback'].some((r) => path.includes(r));
		if (skipRoute || !cookie.user.value) return;
		const user = await authResolveUser(cookie.user);
		if (user) return redirect('/auth/next', 302);
	})
	.get(
		'/login',
		({ query, cookie, oauth2, redirect }) => {
			const redirectTo = cookie.redirectTo.value ?? query.redirectTo;
			if (!redirectTo) return error(400, { error: 'Redirect URL is required' });
			cookie.redirectTo.set({ value: query.redirectTo });
			return redirect(oauth2.createURL('GitHub', []).toString(), 302);
		},
		{
			detail: { summary: 'Login with GitHub' },
			query: t.Object({ redirectTo: t.Optional(t.String()) }),
			cookie: schemaAuthCookie,
		},
	)
	.get(
		'/callback',
		async ({ cookie, oauth2, redirect }) => {
			const _token = await oauth2.authorize('GitHub');
			const member = await resolveTokenUser(_token.accessToken());
			if (!member) return error(401, { error: 'Unauthorized' });
			cookie.user.set({ value: member.id });
			return redirect('/auth/next', 302);
		},
		{ detail: { summary: 'Callback for GitHub OAuth' } },
	)
	.get('/next', ({ cookie, redirect }) => {
		const redirectTo = cookie.redirectTo.value;
		if (!redirectTo) return error(400, { error: 'Redirect URL is required' });
		cookie.redirectTo.remove();
		return redirect(redirectTo, 302);
	});
