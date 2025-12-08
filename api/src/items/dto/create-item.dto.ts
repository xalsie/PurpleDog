import {
    IsString,
    IsEnum,
    IsNotEmptyObject,
    IsNumber,
    IsArray,
    ArrayMinSize,
    ValidateNested,
    IsUrl,
    IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ItemCategory } from '../domain/entities/item.entity';
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

export class CreateItemDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ enum: ItemCategory })
    @IsEnum(ItemCategory)
    category: ItemCategory;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions: DimensionsDto;

    @ApiProperty()
    @IsNumber()
    weight: number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsArray()
    @IsUrl({}, { each: true })
    documents: string[];

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(10)
    @IsUrl({}, { each: true })
    photos: string[];

    @ApiProperty()
    @IsNumber()
    desiredPrice: number;

    @ApiProperty({ enum: ['auction', 'quick-sale'] })
    @IsIn(['auction', 'quick-sale'])
    saleMode: 'auction' | 'quick-sale';
}
