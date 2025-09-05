import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'news' })
@Index(['contentHash'], { unique: true })
export class News {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'source_url', type: 'text' })
  sourceUrl!: string;

  @Column({ name: 'canonical_url', type: 'text', nullable: true, unique: true })
  canonicalUrl?: string | null;

  @Column({ name: 'source_name', type: 'text', nullable: true })
  sourceName?: string | null;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ name: 'content_raw', type: 'text', nullable: true })
  contentRaw?: string | null;

  @Column({ name: 'content_clean', type: 'text', nullable: true })
  contentClean?: string | null;

  @Column({ name: 'content_hash', type: 'text' })
  contentHash!: string;

  @Column({ name: 'language', type: 'text', nullable: true, default: 'en' })
  language?: string | null;

  @Column({ name: 'market', type: 'text', nullable: true })
  market?: string | null;

  @Column({ name: 'published_at_source', type: 'timestamptz', nullable: true })
  publishedAtSource?: Date | null;

  @CreateDateColumn({ name: 'scraped_at', type: 'timestamptz' })
  scrapedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}


