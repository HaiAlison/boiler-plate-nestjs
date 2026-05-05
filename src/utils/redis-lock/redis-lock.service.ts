import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redlock, { Lock } from 'redlock';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedisLockService implements OnModuleDestroy {
  private readonly redlock: Redlock;

  constructor(private readonly redisService: RedisService) {
    const redis = this.redisService.getClient();

    this.redlock = new Redlock([redis], {
      driftFactor: 0.1,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    });

    this.redlock.on('error', (error) => {
      console.error('[RedisLock] Redlock error:', error);
    });
  }

  /**
   * Acquire lock với key và duration (ms).
   * Trả về Lock object, gọi lock.release() khi xong.
   */
  async acquire(resourceKey: string, durationMs = 5000): Promise<Lock> {
    return this.redlock.acquire([`lock:${resourceKey}`], durationMs);
  }

  /**
   * Thực thi callback trong lock, tự release khi xong hoặc lỗi.
   */
  async withLock<T>(
    resourceKey: string,
    durationMs: number,
    fn: (signal: AbortSignal) => Promise<T>,
  ): Promise<T> {
    return this.redlock.using([`lock:${resourceKey}`], durationMs, async (signal) => {
      if (signal?.aborted && (signal as { error?: Error }).error) {
        throw (signal as { error: Error }).error;
      }
      return fn(signal as AbortSignal);
    });
  }

  /**
   * Release lock thủ công.
   */
  async release(lock: Lock): Promise<void> {
    await this.redlock.release(lock);
  }

  async onModuleDestroy(): Promise<void> {
    await this.redlock.quit();
  }
}
