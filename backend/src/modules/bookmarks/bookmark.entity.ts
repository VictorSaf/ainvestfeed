import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { News } from '../news/news.entity';

@Entity({ name: 'bookmarks' })
@Unique('uq_user_news', ['user', 'news'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => News, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news!: News;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}


