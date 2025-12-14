import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Auction, AuctionStatus } from './entities/auction.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { User } from '../user';
import { AuctionsGateway } from '../auctions/auctions.gateway';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
        @InjectRepository(Auction)
        private readonly auctionRepository: Repository<Auction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly auctionsService: AuctionsService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly auctionsGateway: AuctionsGateway,
    ) {}

    async create(dto: CreateBidDto, bidderId: string): Promise<Auction> {
        const auction = await this.auctionsService.findOne(dto.auctionId);

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }
        if (auction.status !== AuctionStatus.ACTIVE) {
            throw new BadRequestException('Auction is not active');
        }
        if (new Date() >= auction.endTime) {
            throw new BadRequestException('Auction has already ended');
        }
        if (auction.item.sellerId === bidderId) {
            throw new ForbiddenException('Seller cannot bid on their own item');
        }

        const bidAmount = dto.amount;
        const currentPrice = Number(auction.currentPrice);

        if (bidAmount <= currentPrice) {
            throw new BadRequestException(
                `Your bid must be higher than the current price of ${currentPrice}`,
            );
        }

        const newBid = this.bidRepository.create({
            auctionId: dto.auctionId,
            bidderId: bidderId,
            amount: bidAmount,
        });

        await this.bidRepository.save(newBid);

        await this.auctionRepository.update(auction.id, {
            currentPrice: bidAmount,
            winnerId: bidderId,
        });

        const updatedAuction = await this.auctionsService.findOne(auction.id);
        if (!updatedAuction) {
            throw new NotFoundException(
                'Auction not found after processing bid',
            );
        }

        this.extendAuctionTime(updatedAuction);
        this.auctionsGateway.broadcastAuctionUpdate(updatedAuction);

        return updatedAuction;
    }

    private getBidIncrement(price: number): number {
        const percent =
            price < 100
                ? 0.1
                : price < 500
                  ? 0.05
                  : price < 1000
                    ? 0.02
                    : price < 5000
                      ? 0.01
                      : 0.005;

        const increment = Math.ceil(price * percent);
        return Math.max(1, increment);
    }

    private async getHighestBid(auctionId: string): Promise<Bid | null> {
        return this.bidRepository.findOne({
            where: { auctionId },
            order: { amount: 'DESC' },
        });
    }

    private extendAuctionTime(auction: Auction): void {
        const now = new Date();
        const timeLeft = new Date(auction.endTime).getTime() - now.getTime();
        const oneHour = 60 * 60 * 1000;

        if (timeLeft < oneHour && timeLeft > 0) {
            const newEndTime = new Date(
                auction.endTime.getTime() + 10 * 60 * 1000,
            );
            auction.endTime = newEndTime;
            this.auctionRepository.save(auction);

            const jobName = `end_auction_${auction.id}`;
            try {
                const job = this.schedulerRegistry.getCronJob(jobName);
                job.setTime(new (require('cron').CronTime)(newEndTime));
                job.start();
            } catch (e) {
                const newEndJob = new (require('cron').CronTime)(
                    newEndTime,
                    async () => {
                        const finalAuction = await this.auctionsService.findOne(
                            auction.id,
                        );
                        if (!finalAuction) return;

                        finalAuction.status = AuctionStatus.ENDED;
                        const updatedAuction =
                            await this.auctionRepository.save(finalAuction);
                        this.auctionsGateway.broadcastAuctionUpdate(
                            updatedAuction,
                        );
                    },
                );
                this.schedulerRegistry.addCronJob(jobName, newEndJob);
                newEndJob.start();
            }
        }
    }
}
