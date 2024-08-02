/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('hotels')
  getHotels(@Body() body: any): Observable<any> {
    return this.appService.getHotels(body);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
