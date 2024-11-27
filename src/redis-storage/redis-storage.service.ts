import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisStorageService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key: string, value: string, expire = 0) {
    try {
      await this.cache.set(key, value, expire); //ttl = second
    } catch (e) {
      console.error('Error in RedisStorageService.set', e);
    }
  }

  async delete(key: string) {
    await this.cache.del(key);
  }

  async keys(pattern) {
    // return await this.cache(pattern);
  }
}
