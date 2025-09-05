import { CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique, Column, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'devices' })
@Unique('uq_user_token', ['user', 'pushToken'])
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'push_token', type: 'text' })
  @Index('idx_devices_push_token')
  pushToken!: string;

  @Column({ name: 'platform', type: 'text', nullable: true })
  platform?: string | null; // ios|android|web

  @Column({ name: 'device_model', type: 'text', nullable: true })
  deviceModel?: string | null;

  @Column({ name: 'locale', type: 'text', nullable: true })
  locale?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}


