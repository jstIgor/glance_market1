import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class RemoveAuthCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: (data) => {
          if (data?.refreshToken) {
            const response = context.switchToHttp().getResponse<Response>();
            response.clearCookie('refreshToken');
          }
        },
        error: (error) => {
          const response = context.switchToHttp().getResponse<Response>();
          response.clearCookie('refreshToken');
        },
      }),
    );
  }
}
