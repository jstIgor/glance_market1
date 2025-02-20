import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { response, Response } from 'express';
@Injectable()
export class SetAuthCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: (data) => {
          if (data?.error) {
            return;
          }
          if (data?.refreshToken) {
            const response = context.switchToHttp().getResponse<Response>();
            response.clearCookie('refreshToken');
            response.cookie('refreshToken', data.refreshToken, {
              httpOnly: true,
              secure: true,
              domain: process.env.SERVER_DOMAIN ?? 'localhost',
              maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE ?? '86400000'),
            });
          }
          if(data?.redirect){
            response.redirect(data.redirect)
          }
        },
      }),
    );
  }
}
