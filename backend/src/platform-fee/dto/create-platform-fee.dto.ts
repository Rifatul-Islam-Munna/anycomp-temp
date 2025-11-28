import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TierName } from '../entities/platform-fee.entity';

export class CreatePlatformFeeDto {
  @ApiProperty({
    description: 'Tier name',
    enum: TierName,
    example: TierName.STANDARD,
  })
  @IsEnum(TierName)
  @IsNotEmpty()
  tier_name: TierName;

  @ApiProperty({
    description: 'Minimum value for this tier',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  min_value: number;

  @ApiProperty({
    description: 'Maximum value for this tier',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  max_value: number;

  @ApiProperty({
    description: 'Platform fee percentage (e.g., 10.5 for 10.5%)',
    example: 10.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  platform_fee_percentage: number;
}

export class UpdatePlatformFeeDto {
  @ApiProperty({
    description: 'Tier name',
    enum: TierName,
    example: TierName.STANDARD,
  })
  @IsEnum(TierName)
  @IsNotEmpty()
  tier_name: TierName;

  @ApiProperty({
    description: 'Minimum value for this tier',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  min_value: number;

  @ApiProperty({
    description: 'Maximum value for this tier',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  max_value: number;

  @ApiProperty({
    description: 'Platform fee percentage (e.g., 10.5 for 10.5%)',
    example: 10.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  platform_fee_percentage: number;
}
