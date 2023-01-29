import { Module } from '@nestjs/common'
import { RewardsService } from './rewards.service'
import { GatewayWalletModule } from '../../../utils/wallets/wallets.module'
import { WavesApiModule } from '../../apis/waves-api/waves-api.module'
import { WeNodeApiModule } from '../../apis/we-node-api/we-node-api.module'

@Module({
  imports: [
    GatewayWalletModule,
    WavesApiModule,
    WeNodeApiModule,
  ],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
