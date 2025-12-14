import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { AuthGuard } from '../security/auth.guard';
import { CurrentUser } from '../user/current-user.decorator';
import { User } from '../user/entities';

@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('intent')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create Stripe PaymentIntent (manual capture)' })
    @ApiResponse({ status: 201, description: 'PaymentIntent created' })
    createPaymentIntent(
        @Body() body: CreatePaymentIntentDto,
        @CurrentUser() user: User,
    ) {
        return this.paymentsService.createPaymentIntent(body, user.id);
    }
}
