import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction, AuctionStatus } from '../bids/entities/auction.entity';
import { ItemSchema } from '../items/infrastructure/typeorm/item.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ItemStatus } from '../items/domain/entities/item.entity';
import { AuctionsGateway } from './auctions.gateway';
import { CronJob } from 'cron';

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private readonly auctionRepository: Repository<Auction>,
        @InjectRepository(ItemSchema)
        private readonly itemRepository: Repository<ItemSchema>,
        private schedulerRegistry: SchedulerRegistry,
        private readonly auctionsGateway: AuctionsGateway,
    ) {}

    async create(dto: CreateAuctionDto): Promise<Auction> {
        const item = await this.itemRepository.findOne({
            where: { id: dto.itemId },
        });
        if (!item) {
            throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
        }
        if (item.status !== ItemStatus.PUBLISHED) {
            throw new BadRequestException(
                `Item must be PUBLISHED to start an auction.`,
            );
        }

        const existingAuction = await this.findByItemId(dto.itemId);
        if (existingAuction) {
            throw new BadRequestException(
                'An auction for this item already exists.',
            );
        }

        const auction = this.auctionRepository.create({
            ...dto,
            item: item,
            itemId: dto.itemId,
            currentPrice: dto.startingPrice,
            status: AuctionStatus.PENDING,
        });

        const savedAuction = await this.auctionRepository.save(auction);
        this.scheduleAuctionJobs(savedAuction);

        return savedAuction;
    }

    async findOne(id: string): Promise<Auction | null> {
        return this.auctionRepository.findOne({
            where: { id },
            // include item.medias so frontend can access item medias
            relations: ['item', 'item.medias', 'bids', 'winner', 'item.seller'],
        });
    }

    async findByItemId(itemId: string): Promise<Auction | null> {
        return this.auctionRepository.findOne({
            where: { itemId },
            // include item.medias so frontend can access item medias
            relations: ['item', 'item.medias', 'bids', 'winner', 'item.seller'],
        });
    }

    private scheduleAuctionJobs(auction: Auction) {
        const startJob: any = new CronJob(auction.startTime, async () => {
            const freshAuction = await this.findOne(auction.id);
            if (freshAuction) {
                freshAuction.status = AuctionStatus.ACTIVE;
                const updatedAuction =
                    await this.auctionRepository.save(freshAuction);
                this.auctionsGateway.broadcastAuctionUpdate(updatedAuction);
                console.log(`Auction ${auction.id} has started.`);
            }
        });

        const endJob: any = new CronJob(auction.endTime, async () => {
            const finalAuction = await this.findOne(auction.id);
            if (!finalAuction) return;

            finalAuction.status = AuctionStatus.ENDED;
            const updatedAuction =
                await this.auctionRepository.save(finalAuction);
            this.auctionsGateway.broadcastAuctionUpdate(updatedAuction);
            console.log(`Auction ${auction.id} has ended.`);
        });

        this.schedulerRegistry.addCronJob(
            `start_auction_${auction.id}`,
            startJob,
        );
        this.schedulerRegistry.addCronJob(`end_auction_${auction.id}`, endJob);

        startJob.start();
        endJob.start();
    }
}
