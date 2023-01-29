import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { WALLETS_PROVIDER } from '../../../types/constants'
import { MainWallets } from '../../../types/common'
import { log, logError } from '../../../utils/log-utils'
import { WavesApi } from '../../apis/waves-api/waves-api.service'
import { WeNodeApiService } from '../../apis/we-node-api/we-node-api.service'
import {
  REWARDS_SEND_INTERVAL,
  REWARDS_SENDING_MULTIPLIER,
  WAVES_DAILY_REWARDS_AMOUNT,
  WAVES_DESTINATION_WALLETS_ADDRESSES,
  WE_DESTINATION_WALLETS_ADDRESSES,
  WEST_DAILY_REWARDS_AMOUNT,
} from '../../../config'

@Injectable()
export class RewardsService implements OnApplicationBootstrap {
  constructor(
    private readonly wavesApi: WavesApi,
    private readonly weNodeApi: WeNodeApiService,
    @Inject(WALLETS_PROVIDER) private readonly mainWallets: MainWallets,
  ) {
  }
  onApplicationBootstrap() {
    this.tick()
  }

  private async tick() {
    await this.sendTransfers()
    setTimeout(() => this.tick(), REWARDS_SEND_INTERVAL)
  }

  async sendTransfers() {
    const weSendAmount = +(
      WEST_DAILY_REWARDS_AMOUNT * REWARDS_SENDING_MULTIPLIER / WE_DESTINATION_WALLETS_ADDRESSES.length
    ).toFixed(8)
    const wavesSendAmount = +(
      WAVES_DAILY_REWARDS_AMOUNT * REWARDS_SENDING_MULTIPLIER / WAVES_DESTINATION_WALLETS_ADDRESSES.length
    ).toFixed(8)
    await Promise.all([
      ...WE_DESTINATION_WALLETS_ADDRESSES.map((address) => this.weSendTransfer(address, weSendAmount)),
      ...WAVES_DESTINATION_WALLETS_ADDRESSES.map((address) => this.wavesSendTransfer(address, wavesSendAmount)),
    ])
  }
  private async wavesSendTransfer(address: string, amount: number) {
    try {
      const { id } = await this.wavesApi.transfer(
        address,
        amount,
      )
      log(`Waves transfer sent ${id} amount ${amount} to ${address}`, 'RewardsService')
    } catch (e) {
      logError(`Waves transfer error ${(e as Error)?.message ?? e}`, (e as Error).stack, 'RewardsService')
    }
  }

  private async weSendTransfer(address: string, amount: number) {
    try {
      const { id } = await this.weNodeApi.transfer(
        address,
        amount,
      )
      log(`We transfer sent ${id} amount ${amount} to ${address}`, 'RewardsService')
    } catch (e) {
      logError(`We transfer error ${(e as Error)?.message ?? e}`, (e as Error).stack, 'RewardsService')
    }
  }
}
