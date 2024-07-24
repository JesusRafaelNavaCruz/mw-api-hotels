/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('hotels')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('hotels')
  @CacheTTL(600)
  getHotels(@Body() body: any): Observable<any> {
    return this.appService.getHotels(body);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
