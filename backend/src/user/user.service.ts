import { ConflictException, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {  LoginDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt  from 'bcrypt'

@Injectable()
export class UserService  implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
   constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    this.seedAdminUser();
  }

  private async seedAdminUser() {
    const count = await this.userRepository.find({where: {role: UserRole.ADMIN}});
    this.logger.debug(`Found ${count.length} admin users`);
    if (count.length === 0) {
      const adminUser = new User();
      adminUser.email = 'admin@gmail.com';
      adminUser.password = await bcrypt.hash('admin123', 10);
      adminUser.name = 'Admin';
      adminUser.role = UserRole.ADMIN;
      await this.userRepository.save(adminUser);
    }
  }
  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: UserRole.USER,
      phone: dto.phone,
      image: dto.image

    });

    const saved = await this.userRepository.save(user);
    const access_token = await this.signToken(saved);

    return {
      user: this.sanitizeUser(saved),
      access_token,
    };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.signToken(user);

    return {
      user: this.sanitizeUser(user),
      access_token,
    };
  }

  private async signToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      phone: user.phone,
      image: user.image,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN'),
      expiresIn: '60d',
    });
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
