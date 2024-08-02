/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MemoryCacheService } from './memory-cache.service';
import { HttpService } from '@nestjs/axios';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(
    private readonly cacheService: MemoryCacheService,
    private readonly httpService: HttpService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    
    const cacheKey = `cache:${req.originalUrl}:${JSON.stringify(req.body)}`; 
    const cacheResponse = this.cacheService.get(cacheKey);    

    if (cacheResponse) {
      return res.status(200).json(cacheResponse);
    } else {
      const originalSend = res.send.bind(res);

      res.send = (body: any) => {
        this.cacheService.set(cacheKey, JSON.stringify(body), 2 * 60 * 1000); // Expira en 24 horas
        return originalSend(body);
      };

      next();
    }
  }
}
