import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
	@PrimaryGeneratedColumn('increment')
	id!: number;

	@Column({ type: 'int', name: 'author_id' })
	authorId!: number;

	@Column({ type: 'text' })
	slug!: string;

	@Column({ type: 'text' })
	title!: string;

	@Column({ type: 'text' })
	content!: string;

	@Column({ type: 'bool', default: false, name: 'is_published' })
	isPublished!: boolean;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	createdAt!: Date;

	@CreateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updatedAt!: Date;
}
