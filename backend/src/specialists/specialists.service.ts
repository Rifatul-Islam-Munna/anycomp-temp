import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';


import { CreateMediaDto, CreateSpecialistDto, findAllDto, FindAllSpecialistsDto, SortByField, SortOrder, UpdateMediaDto, UpdateSpecialistDto } from './dto/create-specialist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialist } from './entities/specialist.entity';
import { IsNull, Repository } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';
import {MimeType }from './entities/media.entity';
import { unlink } from 'fs/promises';
import { cwd } from 'process';
import { join } from 'path';
import { PlatformFeeService } from 'src/platform-fee/platform-fee.service';
import { ServiceOffering } from './entities/service-offering.entity';
@Injectable()
export class SpecialistsService {
  private logger = new Logger(SpecialistsService.name);
   constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly platformService: PlatformFeeService,
      @InjectRepository(ServiceOffering)
    private readonly serviceOfferingRepository: Repository<ServiceOffering>

  ) {}
   async create(createDto: CreateSpecialistDto,userId:string): Promise<Specialist> {
    // Check if ID exists
    const existing = await this.specialistRepository.findOne({
      where: { id: createDto.id },
    });

    if (existing) {
      throw new ConflictException('Specialist with this ID already exists');
    }

    const platformFee = await  this.platformService.calculateFee(createDto.base_price);

    // Create specialist - NO NEED TO ADD media: [] manually!
    const specialist = this.specialistRepository.create({
      id: createDto.id,
      title: createDto.title || 'Untitled',
      category: createDto.category || '',
      description: createDto.description || '',
      duration_days: createDto.duration_days || 1,
      base_price: createDto.base_price || 0,
      platform_fee: platformFee ?? (createDto.base_price ? createDto.base_price * 0.1 : 0),
      company_types: createDto.company_types || [],
      offerings: createDto.offerings || [],
      is_draft: createDto.is_draft ?? true,
      verification_status: createDto.verification_status,
      is_verified: createDto.is_verified ?? false,
      user:userId
    });
     const returnData = await this.specialistRepository.save(specialist);
     const data = await this.serviceOfferingRepository.save({specialists:specialist.id,purchases:0,user_id:userId})
    return returnData;
  }

/* async findAll(
  query: findAllDto,
  userId: string
): Promise<{
  items: Specialist[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}> {
  const {
    is_draft,
    is_published,
    limit = 10,
    page = 1,
  } = query;

  const take = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * take;

  const where: any = {
    deleted_at: IsNull(),
  };

  if (typeof is_draft === 'boolean') {
    where.is_draft = is_draft;
  }

  if (typeof is_published === 'boolean') {
    // if you really mean “published = not draft”
    if (is_published) {
      where.is_draft = false;
    }
  }

  const [items, total] = await this.specialistRepository.findAndCount({
    relations: ['media'],
    where,
    order: { created_at: 'DESC' },
    take,
    skip,
  });

  return {
    items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: take,
      totalPages: Math.ceil(total / take),
      currentPage,
    },
  };
} */




async findAll(
  query: findAllDto,
  userId: string
): Promise<{
  items: ServiceOffering[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}> {
  const {
    is_draft,
    is_published,
    limit = 10,
    page = 1,
 
  } = query;

  const take = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * take;

  const where: any = {};

  // Filter by is_draft if provided
  if (typeof is_draft === 'boolean') {
    where.specialist = { is_draft: is_draft };
  }

  // Filter by is_published if provided
  if (typeof is_published === 'boolean') {
    if (is_published) {
    
       where.specialist = { is_draft: false };
    }
  }

  // Filter by user_id if provided
  if (userId) {
    where.user_id = userId;
  }

  // Filter by specialists if provided
  

  

  const [items, total] = await this.serviceOfferingRepository.findAndCount({
    relations: ['specialist', 'specialist.media', 'user'],
    where,
    order: { created_at: 'DESC' },
    take,
    skip,
  });

  return {
    items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: take,
      totalPages: Math.ceil(total / take),
      currentPage,
    },
  };
}


async findAllForPublic(
  query: FindAllSpecialistsDto,
): Promise<{
  items: Specialist[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}> {
  const {
    page = 1,
    limit = 10,
    sortBy = SortByField.CREATED_AT,
    sortOrder = SortOrder.DESC,
    minPrice,
    maxPrice,
  } = query;

  const take = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * take;

  const qb = this.specialistRepository
    .createQueryBuilder('specialist')
    .leftJoinAndSelect('specialist.media', 'media')
    .where('specialist.deleted_at IS NULL')
    .andWhere('specialist.is_draft = :isDraft', { isDraft: false });

  // price filter on final_price
  if (typeof minPrice === 'number') {
    qb.andWhere('specialist.final_price >= :minPrice', { minPrice });
  }
  if (typeof maxPrice === 'number') {
    qb.andWhere('specialist.final_price <= :maxPrice', { maxPrice });
  }

  // sort
  qb.orderBy(`specialist.${sortBy}`, sortOrder);

  qb.take(take).skip(skip);

  const [items, total] = await qb.getManyAndCount();

  return {
    items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: take,
      totalPages: Math.ceil(total / take),
      currentPage,
    },
  };
}




   async findOne(id: string): Promise<Specialist> {
    this.logger.debug(`findOne(${id})`);

    const specialist = await this.specialistRepository.findOne({
      where: { id, deleted_at:  IsNull()  },
      relations: ['media'], // TypeORM auto-populates media array!
    });

    if (!specialist) {
      throw new NotFoundException(`Specialist with ID ${id} not found`);
    }

    return specialist;
  }

 async update(id: string, updateDto: UpdateSpecialistDto): Promise<Specialist> {
    const specialist = await this.findOne(id);
     this.logger.debug(`check mate(${id})`);

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] !== undefined) {
        specialist[key] = updateDto[key];
      }
    });
     const platformFee = await  this.platformService.calculateFee(updateDto.base_price);
    // Recalculate platform fee
    if (updateDto.base_price !== undefined && updateDto.platform_fee === undefined) {
      specialist.platform_fee = platformFee ?? updateDto.base_price * 0.1;
    }
     this.logger.debug(`issue is here(${id})`);
    await this.specialistRepository.save(specialist);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const specialist = await this.findOne(id);
    await this.specialistRepository.softRemove(specialist);
      await this.serviceOfferingRepository.delete({ specialists: id });
    return {deleted: true};
  }


  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    return MediaType.DOCUMENT;
  }
   async createMedia(createDto: CreateMediaDto, file: Express.Multer.File): Promise<Media> {
    const mediaType = this.getMediaType(file.mimetype);
    const mimeType = file.mimetype as MimeType ;

    const media = this.mediaRepository.create({
      id: createDto.id,
      specialists: createDto.specialist_id, // Just set the foreign key!
      file_name: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      file_size: file.size,
      mime_type: mimeType,
      media_type: mediaType,
      display_order: createDto.display_order ?? 0,
    });

    // TypeORM automatically links this to specialist.media array!
    return await this.mediaRepository.save(media);
  }
  async findBySpecialist(specialistId: string): Promise<Media[]> {
    return await this.mediaRepository.find({
      where: { specialists: specialistId, deleted_at:  IsNull()  },
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }

   async findOneMedia(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id, deleted_at:  IsNull() },
      relations: ['specialist'],
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }


  async updateMedia(id: string, updateDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOneMedia(id);

    if (updateDto.display_order !== undefined) {
      media.display_order = updateDto.display_order;
    }

    await this.mediaRepository.save(media);
    return this.findOneMedia(id);
  }

   async removeMedia(id: string): Promise<{ deleted: boolean }> {
    const media = await this.findOneMedia(id);
    await this.mediaRepository.remove(media);
     const filePath = join(cwd(), media.fileUrl);

  try {
    // Delete local file
    await unlink(filePath);
  } catch (err) {
    // Handle error, e.g. file not found or permission issue
    console.warn(`Failed to delete file at ${filePath}`, err);
  }
    return {deleted: true};
  }
}
