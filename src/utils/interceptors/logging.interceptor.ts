import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const { body, headers, url: apiName, method } = request;

    const variables = { ...body };
    if (variables) {
      Object.keys(variables).forEach((key) => {
        if (/password/i.test(key)) {
          delete variables[key];
        }
      });
    }

    let handler = '';
    const ip = (headers['x-real-ip'] || '127.0.0.1') as string;
    const logs = ['\x1b[32m', ip, '\x1b[0m'];
    if (context['constructorRef']) {
      logs.push(
        ' -> \x1b[33m',
        context['constructorRef'].name,
        '\x1b[0m',
        ' -> \x1b[36m',
        (handler = context['handler'].name),
        '\x1b[0m',
      );
    }
    const startTime = new Date();
    console.log(startTime.toLocaleString('vi').replace(',', ''), ...logs);
    return next.handle().pipe(
      tap(async () => {
        const timing = Date.now() - +startTime;
        console.log('END: ', timing + 'ms', ...logs);
      }),
    );
  }
}
