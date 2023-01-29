import { Module } from '@nestjs/common'
import { AuthApiModule } from '../auth-api/auth-api.module'
import { WavesApi } from './waves-api.service'
import { GatewayWalletModule } from '../../../utils/wallets/wallets.module'

@Module({
  imports: [
    AuthApiModule,
    GatewayWalletModule,
  ],
  providers: [
    WavesApi,
  ],
  exports: [WavesApi],
})

export class WavesApiModule {}
