export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export const IPasswordHasherToken = Symbol('IPasswordHasher');
