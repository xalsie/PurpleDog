import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediasService {
    constructor(
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
    ) {}

    async create(
        itemId: string,
        files: Express.Multer.File[],
        createMediaDto: CreateMediaDto,
    ): Promise<Media[]> {
        console.log(
            'Creating medias for itemId:',
            itemId,
            files,
            createMediaDto,
        );

        const mediaEntities = files.map((file) => {
            const media = new Media();
            media.itemId = itemId;
            media.url = `/uploads/${file.filename}`;
            media.mediaType = createMediaDto.mediaType;
            media.isPrimary = false;
            return media;
        });

        console.log('Media entities to be saved:', mediaEntities);

        return this.mediaRepository.save(mediaEntities);
    }

    findByIds(ids: string[]): Promise<Media[]> {
        return this.mediaRepository.findBy({ id: In(ids) });
    }

    async updateMedia(updateMediaDto: UpdateMediaDto): Promise<boolean> {
        const result = await this.mediaRepository.update(
            { id: In(updateMediaDto.mediaIds) },
            {
                itemId: updateMediaDto.itemId,
                userId: updateMediaDto.userId,
            },
        );

        if (result.affected && result.affected > 0) {
            return true;
        }
        return false;
    }
}
