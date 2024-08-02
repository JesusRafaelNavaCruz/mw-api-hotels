/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { DateUtilService } from './date-util.service';
import { MemoryCacheService } from './memory-cache.service';
import { CacheMiddleware } from './cache.middleware';


@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 600,
      max: 100,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DateUtilService, MemoryCacheService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheMiddleware)
      .forRoutes({path: 'hotels', method: RequestMethod.POST})
  }
}
