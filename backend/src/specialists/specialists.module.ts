import { Module } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from './entities/specialist.entity';
import { Media } from './entities/media.entity';
import { PlatformFeeModule } from 'src/platform-fee/platform-fee.module';
import { ServiceOffering } from './entities/service-offering.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Specialist, Media,ServiceOffering]),
     PlatformFeeModule
  ],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
})
export class SpecialistsModule {}
