import {
    Controller,
    Post,
    Body,
    Param,
    UploadedFiles,
    UseInterceptors,
    Get,
    Res,
    NotFoundException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

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

    @Get('uploads/:filename')
    @Throttle({ default: { limit: 200, ttl: 600 } })
    getUpload(@Param('filename') filename: string, @Res() res: Response) {
        if (filename.includes('..')) {
            throw new NotFoundException();
        }
        const filePath = join(process.cwd(), 'uploads', filename);
        if (!existsSync(filePath)) {
            throw new NotFoundException();
        }
        return res.sendFile(filePath);
    }
}
