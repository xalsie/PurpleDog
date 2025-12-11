import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    isChild?: boolean;
}
