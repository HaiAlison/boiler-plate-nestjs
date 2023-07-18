import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { MessageResponse } from './message.response';

export class SerializerInterceptor implements NestInterceptor {
  // dto is the variable. so you can use this class for different entities
  constructor(private dto: any, private child = '', private options = {}) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<MessageResponse<any>> {
    const now = Date.now();
    // you can write some code to run before request is handled
    return next.handle().pipe(
      // data is the incoming user entity
      map((data: any) => {
        const ob = plainToInstance(
          this.dto,
          this.child ? data[this.child] : data,
          this.options,
        );

        if (this.child) data[this.child] = ob;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return {
          statusCode: statusCode,
          message: statusCode > 299 ? (this.child ? data : ob) : null,
          data: statusCode < 300 ? (this.child ? data : ob) : null,
          duration: `${Date.now() - now}ms`,
        };
      }),
    );
  }
}
