import { type DeepPartial, _dbAll, _dbCreate, _dbGet, _dbRemove, _dbUpdate } from '..';
import { Post } from '../models';

export const dbPostsAll = () => _dbAll(Post);
export const dbPostsGet = (slug: string) => _dbGet(Post, { slug });
export const dbPostsGetById = (id: number) => _dbGet(Post, { id });
export const dbPostsCreate = (item: DeepPartial<Post>) => _dbCreate(Post, item);
export const dbPostsUpdate = (id: number, item: DeepPartial<Post>) => _dbUpdate(Post, { id }, item);
export const dbPostsDelete = (id: number) => _dbRemove(Post, { id });
