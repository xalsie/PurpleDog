import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { User } from '../../user/entities/user.entity';
import { Auction } from './auction.entity';

@Entity('bids')
export class Bid extends BaseEntity {
    @ManyToOne(() => Auction, (auction) => auction.bids, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'auction_id' })
    auction: Auction;

    @Column({ name: 'auction_id' })
    auctionId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bidder_id' })
    bidder: User;

    @Column({ name: 'bidder_id' })
    bidderId: string;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column({
        name: 'max_amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    maxAmount: number | null;

    @Column({ name: 'is_proxy', type: 'boolean', default: false })
    isProxy: boolean;
}
