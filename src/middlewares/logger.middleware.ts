import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const { statusCode } = response;
    const body = request.body;

    console.log(JSON.stringify(request.statusCode));

    response.on('finish', () => {
      this.logger.log(
        ` ${statusCode} ${method} ${originalUrl} - Body: ${JSON.stringify(
          body,
        )}`,
      );
    });
    next();
  }
}
