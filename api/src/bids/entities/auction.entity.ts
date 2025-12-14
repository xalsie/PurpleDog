import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ItemSchema } from '../../items/infrastructure/typeorm/item.schema';
import { User } from '../../user/entities/user.entity';
import { Bid } from './bid.entity';

export enum AuctionStatus {
    PENDING = 'PENDING', // Waiting to start
    ACTIVE = 'ACTIVE', // Currently running
    ENDED = 'ENDED', // Finished
    CANCELLED = 'CANCELLED', // Cancelled by seller or admin
}

@Entity('auctions')
export class Auction extends BaseEntity {
    @OneToOne(() => ItemSchema, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ItemSchema;

    @Column({ name: 'item_id' })
    itemId: string;

    @Column({ name: 'start_time', type: 'timestamp with time zone' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp with time zone' })
    endTime: Date;

    @Column({
        name: 'starting_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
    })
    startingPrice: number;

    @Column({
        name: 'current_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
    })
    currentPrice: number;

    @Column({
        name: 'reserve_price',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    })
    reservePrice: number | null;

    @Column({
        type: 'enum',
        enum: AuctionStatus,
        default: AuctionStatus.PENDING,
    })
    status: AuctionStatus;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'winner_id' })
    winner: User | null;

    @Column({ name: 'winner_id', nullable: true })
    winnerId: string | null;

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids: Bid[];
}
