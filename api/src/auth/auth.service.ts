import { Inject, Injectable } from '@nestjs/common';
import { User, Profile, ProfessionalProfile } from '../user';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type IPasswordHasher, IPasswordHasherToken, type ITokenService, ITokenServiceToken } from '../security/entities';
import { btoa } from 'buffer';
import { RoleEnum } from '../user/entities/role.enum';
import { parseFrenchDate, calculateAge } from '../common/date.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalProfileRepository: Repository<ProfessionalProfile>,
    @Inject(ITokenServiceToken)
    private readonly tokenService: ITokenService,
    @Inject(IPasswordHasherToken)
    private readonly hasher: IPasswordHasher,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<void | Error> {
    try {
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        return new Error('Already exists');
      }
      const hashedPassword = await this.hasher.hash(dto.password.toString());      
      const newUser = this.userRepository.create({
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      });
      const savedUser = await this.userRepository.save(newUser);

      // Compute age and adult certification from French date format (JJ/MM/AAAA)
      const birthDateValue = parseFrenchDate(dto.birthDate);
      if (!birthDateValue) {
        return new Error('Invalid birth date format');
      }
      const age = calculateAge(birthDateValue);
      const isAdult = age >= 18 || (dto.ageConfirmed ?? false);

      if (dto.role === RoleEnum.PROFESSIONAL) {
        const professionalProfile = this.professionalProfileRepository.create({
          userId: savedUser.id,
          companyName: dto.companyName!,
          siretNumber: dto.siret,
          vat: dto.vat,
          kbisDocumentUrl: dto.officialDoc || null,
          websiteUrl: dto.website || null,
          specialties: dto.specialties || [],
          interests: dto.researchItems || [],
        });
        await this.professionalProfileRepository.save(professionalProfile);
      }
      const profile = this.profileRepository.create({
        userId: savedUser.id,
        firstName: dto.firstName!,
        lastName: dto.lastName!,
        addressLine1: dto.address || null,
        photoUrl: dto.profilePhoto || null,
        birthDate: birthDateValue,
        isAdultCertified: isAdult,
      });
      await this.profileRepository.save(profile);

      return;
    } catch (error) {
      return new Error('Error creating user: ' + error);
    }
  }

  async checkEmail(email: string): Promise<{ exists: boolean; role?: string } | Error> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { exists: false };
      }
      return { exists: true, role: user.role };
    } catch (error) {
      return new Error('Error checking email: ' + error);
    }
  }

  async login(loginDto: {email: string, password: string}): Promise<string | Error> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email }, relations: ['profile', 'professionalProfile'] });
    if (!user) {
      return new Error('Email or password invalid');
    }

    const isValid = await this.hasher.compare(password, user.password);
    if (!isValid) {
      return new Error('Email or password invalid');
    }
    await this.userRepository.update({ id: user.id }, { lastLogin: new Date() });
    return  await this.tokenService.generateToken({ userId: user.id, email: user.email, role: user.role });
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
    const newToken = await this.tokenService.generateToken({ userId: foundUser.id, email: foundUser.email, role: foundUser.role });
    return { token: newToken };
  }

  async me(user: User) {
    const foundProfile = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        profile: true,
        professionalProfile: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        lastLogin: true,
        profile: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
          addressLine1: true,
          addressZip: true,
          addressCity: true,
          addressCountry: true,
          birthDate: true,
          isAdultCertified: true,
        },
        professionalProfile: {
          id: true,
          companyName: true,
          siretNumber: true,
          vat: true,
          kbisDocumentUrl: true,
          websiteUrl: true,
          specialties: true,
          interests: true,
          subscriptionStatus: true,
          subscriptionEndDate: true,
        },
      },
    });

    if (!foundProfile) {
      return new Error('User not found');
    }
    return foundProfile;
  } 

  private parseFrenchDate(value: string): Date | null {
    // TODO: remove after refactor; kept for backward compatibility
    return parseFrenchDate(value);
  }
  /**
   * register
   * login (res:  token)
   * forgotPassword (envoi mail)
   * resetPassword
   * refreshToken
   * OTP (bonus)
   * me (res User(Sans OTP + Pwd) + UserProfile get current user with profile)
   * checkEmail
   */
}