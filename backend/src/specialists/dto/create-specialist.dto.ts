// dto/specialist.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VerificationStatus } from '../entities/specialist.entity';

// ============ SPECIALIST DTO ============
export class CreateSpecialistDto {
  @ApiProperty({
    description: 'Specialist UUID from frontend',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    description: 'Title of the specialist service',
    example: 'Professional Logo Design',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Service category',
    example: 'Design & Creative',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Target company types (JSON string or array)',
    example: '["Startup","Enterprise"]',
  })
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').filter(Boolean);
      }
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsOptional()
  company_types?: string[];

  @ApiPropertyOptional({
    description: 'Detailed description',
    example: 'Professional service description...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration in days',
    example: 7,
  })
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration_days?: number;

  @ApiPropertyOptional({
    description: 'Base price',
    example: 99.99,
  })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @IsNumber()
  @Min(0)
  @IsOptional()
  base_price?: number;

  @ApiPropertyOptional({
    description: 'Platform fee (auto-calculated if not provided)',
    example: 9.99,
  })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @IsNumber()
  @Min(0)
  @IsOptional()
  platform_fee?: number;

  @ApiPropertyOptional({
    description: 'Service offerings (JSON string or array)',
    example: '["Source files","Unlimited revisions"]',
  })
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').filter(Boolean);
      }
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsOptional()
  offerings?: string[];

  @ApiPropertyOptional({
    description: 'Draft status (default: true)',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  is_draft?: boolean;

  @ApiPropertyOptional({
    description: 'Verification status',
    enum: VerificationStatus,
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  verification_status?: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Whether verified',
    example: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}

export class UpdateSpecialistDto extends PartialType(
  CreateSpecialistDto,
) {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id?: string; // Make ID optional for updates
}

// ============ MEDIA DTO ============
export class CreateMediaDto {
    @ApiProperty({
    description: 'Specialist UUID to attach media to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @ApiProperty({
    description: 'Specialist UUID to attach media to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  specialist_id: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 0,
    default: 0,
  })
  @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  display_order?: number;


}

export class UpdateMediaDto {
  @ApiPropertyOptional({
    description: 'Display order',
    example: 0,
  })
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  @IsNumber()
  @Min(0)
  @IsOptional()
  display_order?: number;
}

export class DeleteMediaDto {
  @ApiProperty({
    description: 'Media ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}


export class findAllDto {
  @ApiPropertyOptional({
    description: 'Specialist ID to find media for',
    example: 'false',
  })

 @IsOptional()
  @Transform(({value})=> value === "true" ? true : value === true ? true : false)
  @IsBoolean()
  is_draft: boolean;
  @ApiPropertyOptional({
    description: 'Specialist ID to find media for',
    example: 'true',
  })

 @IsOptional()
  @Transform(({value})=> value === "true" ? true : value === true ? true : false)
  @IsBoolean()
  is_published: boolean;

  @ApiProperty({
    description: 'Specialist ID to find media for',
    example: '1',
  })
  @IsOptional()
  @Transform(({value})=>Number(value))
  @IsNumber()
  page: number;
  @ApiProperty({
    description: 'Specialist ID to find media for',
    example: '10',
  })
  @IsOptional()
  @Transform(({value})=>Number(value))
  @IsNumber()
  limit: number;

}

// find-all-specialists.dto.ts


export enum SortByField {
  CREATED_AT = 'created_at',
  PRICE = 'final_price',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindAllSpecialistsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsInt()
  @Min(1)
  page: number = 1;
   @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
   @ApiPropertyOptional()
  // sort by which field
  @IsOptional()
  @IsEnum(SortByField)
  sortBy: SortByField = SortByField.CREATED_AT;
 @ApiPropertyOptional()
  // sort direction
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
   @ApiPropertyOptional()
  // price filter (uses final_price)
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  @IsInt()
  @Min(0)
  minPrice?: number;
 @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
