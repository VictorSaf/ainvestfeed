import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { News } from '../news/news.entity';

export type Recommendation = 'BUY' | 'SELL' | 'HOLD' | 'WATCH';

@Entity({ name: 'analysis_detail' })
export class AnalysisDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => News, { onDelete: 'CASCADE', nullable: false })
  news!: News;

  @Column({ type: 'text', nullable: true })
  instrumentSymbol?: string | null;

  @Column({ type: 'text', nullable: true })
  market?: string | null;

  @Column({ type: 'text' })
  recommendation!: Recommendation;

  @Column({ name: 'confidence_score', type: 'int' })
  confidenceScore!: number; // 0-100

  @Column({ type: 'text' })
  reasoning!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}


