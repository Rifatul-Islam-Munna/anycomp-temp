import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpecialistsModule } from './specialists/specialists.module';
import { PlatformFeeModule } from './platform-fee/platform-fee.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    
    }),
     JwtModule.register({
      global: true,
      secret: "test",
      signOptions: { expiresIn: '60s' },
    }),
       ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      exclude: ['/api*', '/admin*'],
      serveRoot: '/uploads/',
    }),
    // Just like MongooseModule.forRoot() - ONE TIME SETUP
       TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') ,
        port: configService.get('DB_PORT') ,
        username: configService.get('DB_USERNAME') ,
        password: configService.get('DB_PASSWORD') ,
        database: configService.get('DB_DATABASE') ,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production!
        autoLoadEntities: true,
      }),
    }),
    SpecialistsModule,
    PlatformFeeModule,
    UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
