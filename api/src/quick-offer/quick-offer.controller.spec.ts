import { Test, TestingModule } from '@nestjs/testing';
import { QuickOfferController } from './quick-offer.controller';
import { QuickOfferService } from './quick-offer.service';

describe('QuickOfferController', () => {
    let controller: QuickOfferController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuickOfferController],
            providers: [QuickOfferService],
        }).compile();

        controller = module.get<QuickOfferController>(QuickOfferController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
