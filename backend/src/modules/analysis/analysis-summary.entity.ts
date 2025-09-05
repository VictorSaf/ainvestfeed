import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { News } from '../news/news.entity';

@Entity({ name: 'analysis_summary' })
export class AnalysisSummary {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => News, { onDelete: 'CASCADE', nullable: false })
  news!: News;

  @Column({ name: 'summary_text', type: 'text' })
  summaryText!: string;

  @Column({ name: 'sentiment_score', type: 'numeric', nullable: true })
  sentimentScore?: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}


