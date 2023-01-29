import * as waves from '@waves/waves-transactions'
import { WALLETS_PROVIDER, WAVES_TIMEOUT } from '../../../types/constants'
import { WAVES_NODE_ADDRESS } from '../../../config'
import { Inject, Injectable } from '@nestjs/common'
import { MainWallets } from '../../../types/common'
import { WAVES_DECIMALS } from '../../../types/we-node'
import { WaitForWavesTxMiningResponse } from '../../../types/waves-node'

@Injectable()
export class WavesApi {
  constructor(
    @Inject(WALLETS_PROVIDER) private readonly wallets: MainWallets,
  ) {
  }
  waitForTxMining = (txId: string):Promise<WaitForWavesTxMiningResponse> => {
    let intervalTimerId: NodeJS.Timer
    let timeoutTimerId: NodeJS.Timer

    const timeoutPromise = new Promise<WaitForWavesTxMiningResponse>(
      (resolve, reject) => {
        timeoutTimerId = setTimeout(
          () => reject(new Error(`Waves broadcast timeout for txId: ${txId}`)), WAVES_TIMEOUT,
        )
      },
    )

    const confirmedPromised = new Promise<WaitForWavesTxMiningResponse>((resolve, reject) => {
      intervalTimerId = setInterval(async () => {
        try {
          const response = await waves.waitForTx(txId, { apiBase: WAVES_NODE_ADDRESS })
          if (response?.applicationStatus === 'succeeded') {
            clearInterval(intervalTimerId)
            resolve(response as WaitForWavesTxMiningResponse)
          }
        } catch (e) {
          clearInterval(intervalTimerId)
          reject(new Error(`Waves broadcast error for txId: ${txId} - ${e}`))
        }
      }, 5000)
    })
    return Promise.race([timeoutPromise, confirmedPromised])
      .finally(() => {
        clearInterval(intervalTimerId)
        clearInterval(timeoutTimerId)
      })
  }

  transfer = async (recipient: string, amount: number, assetId?: string): Promise<{id: string}> => {
    const tx = await waves.transfer({
      recipient,
      amount: Math.round(amount * WAVES_DECIMALS),
      assetId,
    }, this.wallets.wavesMainWallet.keyPair)
    return waves.broadcast(tx, WAVES_NODE_ADDRESS)
  }
}