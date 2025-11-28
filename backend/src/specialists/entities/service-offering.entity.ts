// src/entities/service-offering.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Specialist } from './specialist.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('service_offerings')
export class ServiceOffering {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   @Column({ type: 'uuid', name: 'specialists', unique: false })
  specialists: string;

 @ManyToOne(() => Specialist)
 @JoinColumn({ name: 'specialists' })
  specialist: string; 


    @Column({ type: 'uuid', name: 'user_id', nullable: true, unique: false })
  user_id: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: string | null; 

  @Column({ type: 'int', default: 0, name: 'purchases' })
  purchases: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
