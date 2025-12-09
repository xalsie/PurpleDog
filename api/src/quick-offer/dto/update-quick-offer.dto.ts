import { PartialType } from '@nestjs/swagger';
import { CreateQuickOfferDto } from './create-quick-offer.dto';

export class UpdateQuickOfferDto extends PartialType(CreateQuickOfferDto) {}
