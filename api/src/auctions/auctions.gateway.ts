import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Auction } from '../bids/entities/auction.entity';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for simplicity, configure properly for production
    },
})
export class AuctionsGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinAuction')
    handleJoinAuction(
        @MessageBody() auctionId: string,
        @ConnectedSocket() client: Socket,
    ) {
        void client.join(auctionId);
        console.log(`Client ${client.id} joined room for auction ${auctionId}`);
    }

    @SubscribeMessage('leaveAuction')
    handleLeaveAuction(
        @MessageBody() auctionId: string,
        @ConnectedSocket() client: Socket,
    ) {
        void client.leave(auctionId);
        console.log(`Client ${client.id} left room for auction ${auctionId}`);
    }

    broadcastAuctionUpdate(auction: Auction) {
        this.server.to(auction.id).emit('auctionUpdate', auction);
    }
}
