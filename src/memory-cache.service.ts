/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryCacheService {
  private cache: Record<string, { data: any; expiry: number }> = {};
  
  set(key: string, value: any, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache[key] = { data: value, expiry };
  }

  get(key: string): any | null {
    const cached = this.cache[key];
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    } else {
        delete this.cache[key];
        return null;
    }

  }

}
