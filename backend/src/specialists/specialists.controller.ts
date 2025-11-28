import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, Query, UseGuards, Req } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { CreateMediaDto, CreateSpecialistDto, findAllDto, FindAllSpecialistsDto, UpdateMediaDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard, type ExpressRequest } from 'auth/auth.guard';


@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  // ==================== SPECIALIST ROUTES ====================

  @Post()
  @ApiOperation({ summary: 'Create a new specialist' })
  @ApiResponse({ status: 201, description: 'Specialist created successfully' })
  @ApiResponse({ status: 409, description: 'Specialist ID already exists' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(AuthGuard)
  create(@Body() createDto: CreateSpecialistDto,@Req() req:ExpressRequest) {
    return this.specialistsService.create(createDto,req?.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all specialists (published only)' })
  @ApiResponse({ status: 200, description: 'List of specialists with media' })
  @UseGuards(AuthGuard)
  findAll(@Query() query:findAllDto,@Req() req:ExpressRequest) {
    return this.specialistsService.findAll(query,req?.user?.id);
  }
  @Get('/public')
  @ApiOperation({ summary: 'Get all specialists (published only)' })
  @ApiResponse({ status: 200, description: 'List of specialists with media' })
  getAllForPublic(@Query() query:FindAllSpecialistsDto) {
    return this.specialistsService.findAllForPublic(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specialist by ID with media' })
  @ApiParam({ name: 'id', description: 'Specialist UUID' })
  @ApiResponse({ status: 200, description: 'Specialist details with media' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  findOne(@Param('id') id: string) {
    return this.specialistsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specialist' })
  @ApiParam({ name: 'id', description: 'Specialist UUID' })
  @ApiResponse({ status: 200, description: 'Specialist updated successfully' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSpecialistDto,
  ) {
    return this.specialistsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specialist (soft delete)' })
  @ApiParam({ name: 'id', description: 'Specialist UUID' })
  @ApiResponse({ status: 200, description: 'Specialist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  remove(@Param('id') id: string) {
    return this.specialistsService.remove(id);
  }

  // ==================== MEDIA ROUTES ====================

  @Post('media')
  @ApiOperation({ summary: 'Upload media file for a specialist' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaDto })
  @ApiResponse({ status: 201, description: 'Media uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid file' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'video/mp4',
          'video/webm',
          'application/pdf',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, MP4, WEBM, PDF',
            ),
            false,
          );
        }
      },
    }),
  )
  createMedia(
    @Body() createDto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.specialistsService.createMedia(createDto, file);
  }

  @Get(':specialistId/media')
  @ApiOperation({ summary: 'Get all media for a specific specialist' })
  @ApiParam({ name: 'specialistId', description: 'Specialist UUID' })
  @ApiResponse({ status: 200, description: 'List of media files' })
  findMediaBySpecialist(@Param('specialistId') specialistId: string) {
    return this.specialistsService.findBySpecialist(specialistId);
  }

  @Get('media/:id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  @ApiResponse({ status: 200, description: 'Media details' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  findOneMedia(@Param('id') id: string) {
    return this.specialistsService.findOneMedia(id);
  }

  @Patch('media/:id')
  @ApiOperation({ summary: 'Update media (e.g., display order)' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  @ApiResponse({ status: 200, description: 'Media updated successfully' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  updateMedia(
    @Param('id') id: string,
    @Body() updateDto: UpdateMediaDto,
  ) {
    return this.specialistsService.updateMedia(id, updateDto);
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Delete media (soft delete)' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  removeMedia(@Param('id') id: string) {
    return this.specialistsService.removeMedia(id);
  }
}
