import { PartialType } from '@nestjs/swagger';
import { CreateMediaDto } from './create-media.dto';
import { IsArray, IsString } from 'class-validator';
export class UpdateMediaDto extends PartialType(CreateMediaDto) {
    @IsArray()
    @IsString({ each: true })
    mediaIds: string[];

    @IsString()
    userId: string;

    @IsString()
    itemId: string;
}
