import { type DeepPartial, _dbAll, _dbCreate, _dbGet, _dbRemove, _dbUpdate } from '..';
import { User } from '../models';

export const dbUsersAll = () => _dbAll(User);
export async function dbUsersGet(id: number) {
	let res = await _dbGet(User, { id });
	if (!res) res = await dbUsersCreate(id);
	return res;
}
export const dbUsersCreate = (id: number) => _dbCreate(User, { id });
export const dbUsersUpdate = (id: number, data: DeepPartial<User>) => _dbUpdate(User, { id }, data);
export const dbUsersRemove = (id: number) => _dbRemove(User, { id });
