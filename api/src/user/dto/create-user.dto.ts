export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  is_adult_certified: boolean;
}
