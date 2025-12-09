import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, User } from '../user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type IPasswordHasher, IPasswordHasherToken, type ITokenService, ITokenServiceToken } from '../security/entities/security.entity';
import { btoa } from 'buffer';

type UserPackage = {
  user: User;
  token: string;
  // userProfile: UserProfile;
};
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(ITokenServiceToken)
    private readonly tokenService: ITokenService,
    @Inject(IPasswordHasherToken)
    private readonly hasher: IPasswordHasher,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void | Error> {
      try {
        const foundUser = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
        if (foundUser) {
          return new Error('Already exists');
        }
      } catch (error) {
        return new Error('Error checking for existing user: ' + error);
      }

      const hashedPassword = await this.hasher.hash(createUserDto.password.toString())
      createUserDto.password = hashedPassword;
      try {
        const newUser = this.userRepository.create(createUserDto);
        await this.userRepository.save(newUser);
        return;
      } catch (error) {
        return new Error('Error creating user: ' + error);
      }
    }

  async login(loginDto: {email: string, password: string}): Promise<UserPackage | Error> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return new Error('Email or password invalid')
        }

        const isValid = await this.hasher.compare(password, user.password)
        if (!isValid) {
            return new Error('Email or password invalid')
        }
        await this.userRepository.update({  id: user.id}, {lastLogin: new Date()})

        const userPackage: UserPackage = {
            user: user,
            token: await this.tokenService.generateToken({ id: user.id, email: user.email, role: user.role }),
            // userProfile: await this.userProfileService.findByUserId(user.id),
        }
        return userPackage
  }

  async forgot(email: string) {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    if (!foundUser) {
      return new Error('Invalid email address');
    }

    const resetToken = btoa(foundUser.password);
    return // TODO: implement email sending with reset token;
  }

  async reset(token: string, newPassword: string) {
    const decodedPassword = atob(token);
    const foundUser = await this.userRepository.findOne({ where: { password: decodedPassword } });
    if (!foundUser) {
      return new Error('Invalid token');
    }
    const hashedPassword = await this.hasher.hash(newPassword);
    foundUser.password = hashedPassword;
    await this.userRepository.save(foundUser);
    return;
  }

  async refreshToken(user: User) {
    const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!foundUser) {
      return new Error('Invalid refresh token');
    }
    const newToken = await this.tokenService.generateToken({ id: foundUser.id, email: foundUser.email, role: foundUser.role });
    return { token: newToken };
  }
}
/**
   * register
   * login (res: User(Sans OTP + Pwd) + UserProfile + token)
   * forgotPassword (envoi mail)
   * resetPassword
   * refreshToken
   * OTP (bonus)
   */