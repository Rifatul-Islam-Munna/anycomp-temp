import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseFloatPipe } from '@nestjs/common';
import { PlatformFeeService } from './platform-fee.service';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('platform-fee')
@Controller('platform-fee')
export class PlatformFeeController {
  constructor(private readonly platformFeeService: PlatformFeeService) {}

   @Post()
  @ApiOperation({ 
    summary: 'Create new platform fee configuration',
    description: 'WARNING: This will permanently delete any existing platform fee configuration. Only one can exist at a time.'
  })
  @ApiResponse({ status: 201, description: 'Platform fee created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDto: CreatePlatformFeeDto) {
    return this.platformFeeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current platform fee configuration' })
  @ApiResponse({ status: 200, description: 'Current platform fee configuration' })
  @ApiResponse({ status: 404, description: 'No platform fee configuration found' })
  findCurrent() {
    return this.platformFeeService.findCurrent();
  }

  @Get('calculate')
  @ApiOperation({ summary: 'Calculate platform fee for a given amount' })
  @ApiQuery({ name: 'amount', description: 'Amount to calculate fee for', example: 100 })
  @ApiResponse({ status: 200, description: 'Calculated platform fee' })
  async calculateFee(@Query('amount', ParseFloatPipe) amount: number) {
    const fee = await this.platformFeeService.calculateFee(amount);
    return {
      amount,
      fee,
      total: amount + fee,
    };
  }

  @Patch()
  @ApiOperation({ summary: 'Update current platform fee configuration' })
  @ApiResponse({ status: 200, description: 'Platform fee updated successfully' })
  @ApiResponse({ status: 404, description: 'No platform fee configuration found' })
  update(@Body() updateDto: UpdatePlatformFeeDto) {
    return this.platformFeeService.update(updateDto);
  }

  @Delete()
  @ApiOperation({ 
    summary: 'Delete current platform fee configuration',
    description: 'Permanently deletes the platform fee configuration'
  })
  @ApiResponse({ status: 200, description: 'Platform fee deleted successfully' })
  @ApiResponse({ status: 404, description: 'No platform fee configuration found' })
  remove() {
    return this.platformFeeService.remove();
  }
}
