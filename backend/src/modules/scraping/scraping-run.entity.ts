import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ScrapingConfig } from './scraping-config.entity';

@Entity({ name: 'scraping_runs' })
export class ScrapingRun {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ScrapingConfig, { nullable: false })
  config!: ScrapingConfig;

  @CreateDateColumn({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt?: Date | null;

  @Column({ type: 'text', default: 'running' })
  status!: 'running' | 'success' | 'failed';

  @Column({ name: 'items_found', type: 'int', default: 0 })
  itemsFound!: number;
}


