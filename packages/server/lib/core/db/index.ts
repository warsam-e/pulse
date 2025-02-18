import { DataSource, type DeepPartial, type EntityTarget, type FindOptionsWhere, type ObjectLiteral } from 'typeorm';
import { IS_PROD } from '../utils';
import { Post, User } from './models';

const AppDataSource = new DataSource({
	type: 'postgres',
	host: IS_PROD ? 'pulse_db' : 'localhost',
	port: 5432,
	username: 'pulse',
	password: 'pulse',
	database: 'pulse',
	entities: [User, Post],
	synchronize: true,
	logging: ['error', 'info', 'warn'],
});

console.time('[Pulse DB] Initialize');
await AppDataSource.initialize();
console.timeEnd('[Pulse DB] Initialize');

const getSource = <T extends ObjectLiteral>(target: EntityTarget<T>) => AppDataSource.getRepository<T>(target);

export const _dbGet = <T extends ObjectLiteral>(target: EntityTarget<T>, by: FindOptionsWhere<T>) =>
	getSource(target).findOneBy(by);
export const _dbAll = <T extends ObjectLiteral>(target: EntityTarget<T>) => getSource(target).find();

export async function _dbCreate<T extends ObjectLiteral>(target: EntityTarget<T>, entityLike: DeepPartial<T>) {
	const source = getSource(target);
	const item = source.create(entityLike);
	return await source.save(item);
}

export async function _dbUpdate<T extends ObjectLiteral, Data extends T>(
	target: EntityTarget<T>,
	by: FindOptionsWhere<T>,
	entityLike: DeepPartial<Data>,
) {
	const source = getSource(target);
	const item = await source.findOneBy(by);
	if (!item) throw new Error('Item not found');
	source.merge(item, entityLike);
	return await source.save(item);
}

export async function _dbRemove<T extends ObjectLiteral>(target: EntityTarget<T>, by: FindOptionsWhere<T>) {
	const source = getSource(target);
	const item = await source.findOneBy(by);
	if (item) await source.remove(item);
}

export * from 'typeorm';

