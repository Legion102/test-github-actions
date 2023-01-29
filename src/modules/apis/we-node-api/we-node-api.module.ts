import { forwardRef, Module } from '@nestjs/common'
import { WeNodeApiService } from './we-node-api.service'
import { AuthApiModule } from '../auth-api/auth-api.module'
import { nodeConfigProvider } from './node-config.provider'
import { NODE_CONFIG, SEED_MANAGER, TRANSACTION_BROADCASTER } from '../../../types/constants'
import { transactionBroadcasterProvider } from './transaction-broadcaster.provider'
import { seedManagerProvider } from './seed-manger.provider'
import { GatewayWalletModule } from '../../../utils/wallets/wallets.module'

@Module({
  imports: [
    AuthApiModule,
    forwardRef(() => GatewayWalletModule),
  ],
  providers: [
    WeNodeApiService,
    nodeConfigProvider,
    transactionBroadcasterProvider,
    seedManagerProvider,
  ],
  exports: [WeNodeApiService, NODE_CONFIG, TRANSACTION_BROADCASTER, SEED_MANAGER],
})

export class WeNodeApiModule {}
