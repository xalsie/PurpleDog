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
import { User } from '../user/entities/user.entity';
import { AuctionsGateway } from '../auctions/auctions.gateway';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
        @InjectRepository(Auction)
        private readonly auctionRepository: Repository<Auction>,
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

        const bidAmount = dto.maxAmount ?? dto.amount;
        const highestBid = await this.getHighestBid(auction.id);
        const currentPrice = highestBid
            ? Number(highestBid.amount)
            : Number(auction.currentPrice);

        const nextValidBid = currentPrice + this.getBidIncrement(currentPrice);

        if (bidAmount < nextValidBid) {
            throw new BadRequestException(
                `Your bid must be at least ${nextValidBid}`,
            );
        }

        const newBid = this.bidRepository.create({
            auctionId: dto.auctionId,
            bidderId: bidderId,
            amount: dto.amount,
            maxAmount: dto.maxAmount,
            isProxy: !!dto.maxAmount,
        });

        await this.bidRepository.save(newBid);

        await this.processBids(auction.id);

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

    private async processBids(auctionId: string): Promise<void> {
        const auction = await this.auctionRepository.findOne({
            where: { id: auctionId },
            relations: ['bids', 'bids.bidder'],
        });
        if (!auction) return;

        const bids = auction.bids.sort((a, b) => {
            const maxA = a.maxAmount ?? a.amount;
            const maxB = b.maxAmount ?? b.amount;
            if (maxA !== maxB) {
                return maxB - maxA;
            }
            return a.createDateTime.getTime() - b.createDateTime.getTime();
        });

        if (bids.length === 0) {
            return;
        }

        let currentPrice = auction.startingPrice;
        let winner: User | null = null;

        if (bids.length === 1) {
            currentPrice = auction.startingPrice;
            winner = bids[0].bidder;
        } else {
            const topBid = bids[0];
            const secondTopBid = bids[1];

            const topMax = topBid.maxAmount ?? topBid.amount;
            const secondMax = secondTopBid.maxAmount ?? secondTopBid.amount;

            if (topMax > secondMax) {
                const increment = this.getBidIncrement(secondMax);
                currentPrice = Math.min(topMax, secondMax + increment);
                winner = topBid.bidder;
            } else {
                // Equal max bids
                currentPrice = topMax;
                winner = topBid.bidder; // Winner is the one who bid first
            }
        }

        auction.currentPrice = currentPrice;
        auction.winner = winner;
        if (winner) {
            auction.winnerId = winner.id;
        }

        await this.auctionRepository.save(auction);
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
