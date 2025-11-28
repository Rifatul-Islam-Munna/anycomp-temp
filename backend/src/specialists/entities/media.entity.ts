import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Specialist } from './specialist.entity';

export enum MimeType {
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_WEBP = 'image/webp',
  IMAGE_GIF = 'image/gif',
  VIDEO_MP4 = 'video/mp4',
  VIDEO_WEBM = 'video/webm',
  APPLICATION_PDF = 'application/pdf',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity('media')
export class Media {
   @PrimaryColumn('uuid') 
  id: string;

  @Column({ type: 'uuid' })
  specialists: string;

   @ManyToOne(() => Specialist, (specialist) => specialist.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialists' })
  specialist: Specialist;
  

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'int' })
  file_size: number;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({
    type: 'enum',
    enum: MimeType,
  })
  mime_type: MimeType;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  media_type: MediaType;
  @Column()
  fileUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
