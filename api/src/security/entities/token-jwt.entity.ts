export interface ITokenService {
  generateToken(payload: Record<string, any>): Promise<string>;
  validateToken(token: string): Promise<Record<string, any> | null>;
}

export const ITokenServiceToken = Symbol('ITokenService');
