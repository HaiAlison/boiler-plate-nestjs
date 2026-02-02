import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { RedisLockService } from './utils/redis-lock/redis-lock.service';

@Injectable()
export class AppService {
  constructor(private readonly redisLock: RedisLockService) {}

  getHello(i18n: I18nContext): string {
    return 'Hello ' + i18n.t('object.VN');
  }

  /**
   * Demo: acquire lock thủ công, giữ vài giây rồi release.
   */
  async demoManualLock(resourceKey: string, holdMs: number): Promise<{ ok: boolean; message: string }> {
    const lock = await this.redisLock.acquire(resourceKey, holdMs + 2000);
    try {
      await new Promise((resolve) => setTimeout(resolve, holdMs));
      return { ok: true, message: `Lock "${resourceKey}" held for ${holdMs}ms and released.` };
    } finally {
      await this.redisLock.release(lock);
    }
  }

  /**
   * Demo: dùng withLock để chạy logic trong lock (tự acquire/release).
   */
  async demoWithLock(resourceKey: string): Promise<{ ok: boolean; message: string }> {
    return this.redisLock.withLock(resourceKey, 5000, async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { ok: true, message: `Executed inside lock "${resourceKey}".` };
    });
  }
}
