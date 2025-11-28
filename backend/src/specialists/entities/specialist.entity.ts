import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Media } from './media.entity';
import { User } from 'src/user/entities/user.entity';
export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('specialists')
export class Specialist {
  @PrimaryColumn('uuid') 
  id: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ type: 'boolean', default: true })
  is_draft: boolean;

  @Column({ type: 'int', default: 0 })
  total_number_of_ratings: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platform_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_price: number;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'int' })
  duration_days: number;

  // NEW FIELDS FROM FRONTEND
  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'simple-array' }) // Stores as comma-separated string
  company_types: string[];

  @Column({ type: 'simple-array' }) // Stores as comma-separated string
  offerings: string[];
@OneToMany(() => Media, (media) => media.specialist)
  media: Media[];
 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // Auto-generate slug from title
 @BeforeInsert()
@BeforeUpdate()
generateSlug() {
  if (this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Generate random 8-character alphanumeric string
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    
    this.slug = `${baseSlug}-${randomSuffix}`;
  }
}


  // Auto-calculate final_price
  @BeforeInsert()
  @BeforeUpdate()
  calculateFinalPrice() {
    const base = parseFloat(this.base_price.toString());
    const fee = parseFloat(this.platform_fee.toString());
    this.final_price = base + fee;
  }

  
   @Column({ type: 'uuid', name: 'user_id', nullable: true })
  user: string | null;

}
