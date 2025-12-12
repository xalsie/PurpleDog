import { IsArray, IsString } from 'class-validator';

export class CreateImageAnalysisDto {
    @IsString()
    category: string;

    @IsArray()
    @IsString({ each: true })
    medias: string[];
}
