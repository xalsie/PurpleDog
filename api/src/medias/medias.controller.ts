import {
    Controller,
    Post,
    Body,
    Param,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediasService: MediasService) {}

    @Post('/upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(
        @Param('itemId') itemId: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createMediaDto: CreateMediaDto,
    ) {
        return this.mediasService.create(itemId, files, createMediaDto);
    }

    @Post('/update')
    updateMedia(@Body() updateMediaDto: UpdateMediaDto) {
        return this.mediasService.updateMedia(updateMediaDto);
    }
}
