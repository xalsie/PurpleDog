import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ResearchItemDto {
    @ApiProperty({ example: 'vin' })
    @IsString()
    query?: string;

    @ApiProperty({ example: '["Art","Books"]' })
    @IsArray()
    category?: string[];
}
