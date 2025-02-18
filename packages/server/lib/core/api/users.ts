import type { User } from '../db/models';
import { dbUsersAll, dbUsersGet, dbUsersRemove, dbUsersUpdate } from '../db/queries';
import type { PulseUser, PulseUserUpdate } from '../types';
import { PulseError } from '../utils';
import { githubUserById } from './octo';

// MARK: - Lookup
async function _resolveUsers(raw: User[]) {
	const githubRes = (await Promise.all(raw.map((user) => githubUserById(user.id))))
		.filter((r) => r.status === 200)
		.map((r) => r.data);

	const results: PulseUser[] = [];
	for (const user of raw) {
		const res = githubRes.find((r) => r.id === user.id);
		if (!res) continue;

		results.push({
			id: user.id,
			isAdmin: user.isAdmin,
			isBanned: user.isBanned,
			username: res.login,
			name: res.name,
			avatar: res.avatar_url,
			followers: res.followers,
			following: res.following,
			location: res.location,
			twitterUsername: res.twitter_username ?? null,
			company: res.company,
			createdAt: user.createdAt.toString(),
			updatedAt: user.updatedAt.toString(),
		});
	}

	return results;
}

export async function pulseUsersAll(): Promise<PulseUser[]> {
	const users = await dbUsersAll();
	if (!users.length) return [];

	return _resolveUsers(users);
}

export async function pulseUsersGet(id: number): Promise<PulseUser> {
	const user = await dbUsersGet(id);
	if (!user) throw new PulseError(404, 'User not found');
	const res = await _resolveUsers([user]).then((r) => r.at(0));
	if (!res) throw new PulseError(404, 'User not found');
	return res;
}

// MARK: - Admin Actions

export async function pulseUsersUpdate(id: number, data: PulseUserUpdate): Promise<PulseUser> {
	const user = await dbUsersGet(id);
	if (!user) throw new PulseError(404, 'User not found');

	await dbUsersUpdate(id, {
		isAdmin: data.isAdmin ?? undefined,
		isBanned: data.isBanned ?? undefined,
		updatedAt: new Date(),
	});

	const res = await _resolveUsers([user]).then((r) => r.at(0));
	if (!res) throw new PulseError(404, 'User not found');
	return res;
}

export async function pulseUsersDelete(id: number): Promise<void> {
	const user = await dbUsersGet(id);
	if (!user) throw new PulseError(404, 'User not found');
	await dbUsersRemove(id);
}
