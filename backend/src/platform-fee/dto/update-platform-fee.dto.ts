import { PartialType } from '@nestjs/swagger';
import { CreatePlatformFeeDto } from './create-platform-fee.dto';

export class UpdatePlatformFeeDto extends PartialType(CreatePlatformFeeDto) {}
