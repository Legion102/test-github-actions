import { Module } from '@nestjs/common'
import { WALLETS_PROVIDER, SEED_MANAGER } from '../../types/constants'
import { WeNodeApiModule } from '../../modules/apis/we-node-api/we-node-api.module'
import { logError } from '../log-utils'
import { SeedManager } from '@wavesenterprise/voting-blockchain-tools/node/seed/common'
import { MainWallets } from '../../types/common'
import { WAVES_CHAIN_ID, WAVES_MAIN_WALLET_SEED, WE_MAIN_WALLET_SEED } from '../../config'
import * as waves from '@waves/waves-transactions'

@Module({
  imports: [
    WeNodeApiModule,
  ],
  providers: [
    {
      provide: WALLETS_PROVIDER,
      useFactory: async (
        seedManager: SeedManager,
      ): Promise<MainWallets> => {
        try {
          const weMainWallet = await seedManager.restoreFromPhrase(WE_MAIN_WALLET_SEED)
          const wavesMainWallet = new waves.seedUtils.Seed(WAVES_MAIN_WALLET_SEED, WAVES_CHAIN_ID)

          return {
            weMainWallet,
            wavesMainWallet,
          }
        }
        catch (err) {
          logError(`Cant get parse gateway wallets: ${(err as Error).message}`, (err as Error).stack, 'GATEWAY_WALLETS_PROVIDER')
          process.exit(2)
        }
      },
      inject: [SEED_MANAGER],
    },
  ],
  exports: [WALLETS_PROVIDER],
})
export class GatewayWalletModule {}