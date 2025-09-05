import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return (jwt as any).sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: { sub: string }): string {
  return (jwt as any).sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return (jwt as any).verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return (jwt as any).verify(token, config.JWT_REFRESH_SECRET) as { sub: string };
}


