import {
    IsString,
    IsEnum,
    IsNotEmptyObject,
    IsNumber,
    IsArray,
    ArrayMinSize,
    ValidateNested,
    IsUrl,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleType } from '../domain/entities/item.entity';
import { MediaType } from '../domain/entities/media.type';
import { ApiProperty } from '@nestjs/swagger';

class DimensionsDto {
    @ApiProperty()
    @IsNumber()
    height: number;

    @ApiProperty()
    @IsNumber()
    width: number;

    @ApiProperty()
    @IsNumber()
    depth: number;
}

class MediaDto {
    @ApiProperty()
    @IsUrl()
    url: string;

    @ApiProperty({ enum: MediaType })
    @IsEnum(MediaType)
    type: MediaType;

    @ApiProperty({ required: false })
    @IsOptional()
    isPrimary?: boolean;
}

export class CreateItemDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    sellerId: number;

    @ApiProperty()
    @IsNumber()
    category: string[];

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions: DimensionsDto;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    weight_kg?: number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ type: [MediaDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => MediaDto)
    medias: MediaDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    desired_price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    ai_estimated_price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    min_price_accepted?: number;

    @ApiProperty({ enum: SaleType })
    @IsEnum(SaleType)
    sale_type: SaleType;
}
