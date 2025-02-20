import { JwtModuleOptions } from './../../node_modules/@nestjs/jwt/dist/interfaces/jwt-module-options.interface.d';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.getOrThrow('JWT_SECRET'),
    
  };
};
