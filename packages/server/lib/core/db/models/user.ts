import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'bool', default: false, name: 'is_admin' })
	isAdmin!: boolean;

	@Column({ type: 'bool', default: false, name: 'is_banned' })
	isBanned!: boolean;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt!: Date;

	@CreateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt!: Date;
}
