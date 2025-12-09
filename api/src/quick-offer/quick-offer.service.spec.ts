import { Test, TestingModule } from '@nestjs/testing';
import { QuickOfferService } from './quick-offer.service';

describe('QuickOfferService', () => {
    let service: QuickOfferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuickOfferService],
        }).compile();

        service = module.get<QuickOfferService>(QuickOfferService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
