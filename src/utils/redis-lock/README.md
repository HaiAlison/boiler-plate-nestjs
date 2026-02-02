# Redis Lock (Distributed Lock)

Distributed lock dựa trên [Redlock](https://github.com/mike-marcacci/node-redlock) và Redis, dùng để tránh race condition khi nhiều instance hoặc nhiều request cùng thao tác trên một tài nguyên.

## Yêu cầu

- **Redis** đang chạy và cấu hình trong `.env`
- **RedisModule** đã được import trong `AppModule` (cung cấp kết nối Redis)

## Cấu hình

Trong `.env`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Cài đặt module

Trong `AppModule`:

```ts
import { RedisModule } from './utils/redis/redis.module';
import { RedisLockModule } from './utils/redis-lock/redis-lock.module';

@Module({
  imports: [
    RedisModule,
    RedisLockModule,
    // ...
  ],
})
export class AppModule {}
```

`RedisLockModule` phụ thuộc `RedisModule`; cần import `RedisModule` trước.

## API – RedisLockService

Inject `RedisLockService` vào service hoặc controller của bạn:

```ts
constructor(private readonly redisLock: RedisLockService) {}
```

### 1. `acquire(resourceKey, durationMs?)` – Lấy lock thủ công

- **resourceKey**: Chuỗi định danh tài nguyên (sẽ được prefix thành `lock:{resourceKey}`).
- **durationMs**: Thời gian giữ lock (ms), mặc định `5000`.
- **Returns**: `Promise<Lock>`. Bắt buộc gọi `release(lock)` khi xong (thường dùng trong `try/finally`).

```ts
const lock = await this.redisLock.acquire('order-123', 10000);
try {
  // Thao tác cần bảo vệ
  await this.processOrder('order-123');
} finally {
  await this.redisLock.release(lock);
}
```

### 2. `withLock(resourceKey, durationMs, fn)` – Lock + callback, tự release

- **resourceKey**: Chuỗi định danh tài nguyên.
- **durationMs**: Thời gian giữ lock (ms).
- **fn**: Hàm async chạy trong lock; nhận `AbortSignal` (dùng khi Redlock cần báo abort).
- **Returns**: `Promise<T>` – giá trị trả về của `fn`. Lock tự release khi `fn` xong hoặc throw.

```ts
const result = await this.redisLock.withLock('order-123', 5000, async (signal) => {
  if (signal?.aborted) throw (signal as any).error;
  return await this.processOrder('order-123');
});
```

### 3. `release(lock)` – Trả lock

- **lock**: Object `Lock` trả về từ `acquire()`.
- Dùng khi bạn gọi `acquire()` thủ công; không cần gọi khi dùng `withLock()`.

## Ví dụ trong service

```ts
@Injectable()
export class OrderService {
  constructor(private readonly redisLock: RedisLockService) {}

  async createOrder(userId: string, items: Item[]) {
    const lockKey = `order:create:${userId}`;
    return this.redisLock.withLock(lockKey, 10000, async () => {
      const existing = await this.orderRepo.findPendingByUser(userId);
      if (existing.length > 0) throw new ConflictException('Pending order exists');
      return this.orderRepo.save({ userId, items });
    });
  }
}
```

## Demo endpoints

Dự án có sẵn hai endpoint để thử lock:

| Method | URL | Mô tả |
|--------|-----|--------|
| GET | `/lock/demo?key=...&hold=...` | Acquire lock thủ công, giữ `hold` ms rồi release. `key` mặc định `demo-key`, `hold` mặc định 2000, tối đa 10000. |
| GET | `/lock/with-lock?key=...` | Chạy logic trong `withLock()` với key tùy chọn. |

Ví dụ:

```bash
# Giữ lock "my-resource" 3 giây
curl "http://localhost:3001/lock/demo?key=my-resource&hold=3000"

# Chạy với lock "my-resource"
curl "http://localhost:3001/lock/with-lock?key=my-resource"
```

Gọi hai request cùng `key` và `hold` lớn (vd 5000) để thấy request thứ hai chờ lock (retry) cho đến khi request đầu trả lock.

## Lưu ý

- Lock key trong Redis có dạng `lock:{resourceKey}`. Cùng `resourceKey` = cùng một lock.
- Luôn release lock trong `finally` khi dùng `acquire()` để tránh lock bị giữ khi throw.
- `durationMs` nên lớn hơn thời gian xử lý dự kiến; nếu xử lý lâu hơn, lock hết hạn và có thể bị instance khác lấy.
- Redlock có retry (số lần và delay có thể cấu trong service). Nếu không lấy được lock sau khi retry hết, sẽ throw.
