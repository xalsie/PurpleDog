export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export const IPasswordHasherToken = Symbol('IPasswordHasher');

export interface ITokenService {
  generateToken(payload: Record<string, any>): Promise<string>;
  validateToken(token: string): Promise<Record<string, any> | null>;
}

export const ITokenServiceToken = Symbol('ITokenService');
