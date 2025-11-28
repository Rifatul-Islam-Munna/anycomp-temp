import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformFee } from './entities/platform-fee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlatformFeeService implements OnModuleInit {
    constructor(
    @InjectRepository(PlatformFee)
    private readonly platformFeeRepository: Repository<PlatformFee>,
  ) {}
  onModuleInit() {
    this.seedPlatformFee();
  }
   private async seedPlatformFee() {
    const count = await this.platformFeeRepository.count();
    if (count === 0) {
      const platformFee = new PlatformFee();
      platformFee.platform_fee_percentage = 5;
      await this.platformFeeRepository.save(platformFee);
    }
   }
 async create(createDto: CreatePlatformFeeDto): Promise<PlatformFee> {
  // Completely clear the table
  await this.platformFeeRepository.clear();

  const platformFee = this.platformFeeRepository.create(createDto);
  return this.platformFeeRepository.save(platformFee);
}


 async findCurrent(): Promise<PlatformFee> {
  const fees = await this.platformFeeRepository.find({
    order: { created_at: 'DESC' },
    take: 1, // Get only 1 result
  });

  if (!fees || fees.length === 0) {
    throw new NotFoundException('No platform fee configuration found');
  }

  return fees[0];
}


  findOne(id: number) {
    return `This action returns a #${id} platformFee`;
  }

    async update(updateDto: UpdatePlatformFeeDto): Promise<PlatformFee> {
    const platformFee = await this.findCurrent();

    Object.assign(platformFee, updateDto);

    return await this.platformFeeRepository.save(platformFee);
  }

 async remove(): Promise<void> {
    const platformFee = await this.findCurrent();
    await this.platformFeeRepository.remove(platformFee);
  }
  async calculateFee(amount: number | undefined): Promise<number> {
    if(!amount) return 0;
    const platformFee = await this.findCurrent();
    return (amount * platformFee.platform_fee_percentage) / 100;
  }
}
