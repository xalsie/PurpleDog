import { IsEnum } from 'class-validator';
import { MediaType } from '../../items/domain/entities/media.type';

export class CreateMediaDto {
    @IsEnum(MediaType)
    mediaType: MediaType;
}
