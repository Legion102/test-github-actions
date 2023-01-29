import { AxiosInstance } from 'axios'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { AUTH_CLIENTS_TOKEN, AuthorizedClients } from '../../../types/auth'
import {
  WALLETS_PROVIDER,
  NODE_CONFIG,
  SEED_MANAGER,
  TRANSACTION_BROADCASTER,
  WAVES_TIMEOUT,
} from '../../../types/constants'
import { NodeConfig, TransactionInfo, WEST_DECIMALS } from '../../../types/we-node'
import { KeyPair, TransactionBroadcaster, TransferTx } from '@wavesenterprise/voting-blockchain-tools/transactions'
import { SeedManager } from '@wavesenterprise/voting-blockchain-tools/node/seed/common'
import { WE_NODE_ADDRESS } from '../../../config'
import { logError } from '../../../utils/log-utils'
import { MainWallets } from '../../../types/common'

@Injectable()
export class WeNodeApiService {
  private readonly nodeAddress: string
  private readonly axios: AxiosInstance
  private readonly walletKeyPair: KeyPair

  constructor(
    @Inject(NODE_CONFIG) private readonly nodeConfig: NodeConfig,
    @Inject(TRANSACTION_BROADCASTER) private readonly transactionBroadcaster: TransactionBroadcaster,
    @Inject(SEED_MANAGER) private readonly seedManager: SeedManager,
    @Inject(AUTH_CLIENTS_TOKEN) authClients: AuthorizedClients,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Inject(forwardRef(() => WALLETS_PROVIDER)) private readonly wallets: MainWallets,
  ) {
    this.nodeAddress = WE_NODE_ADDRESS
    this.axios = authClients.weNodeClient
    this.walletKeyPair = wallets.weMainWallet.keyPair
  }

  waitForTxMining = (txId: string):Promise<TransactionInfo> => {
    let intervalTimerId: NodeJS.Timer
    let timeoutTimerId: NodeJS.Timer

    const timeoutPromise = new Promise<TransactionInfo>(
      (resolve, reject) => {
        timeoutTimerId = setTimeout(
          () => reject(new Error(`Waves broadcast timeout for txId: ${txId}`)), WAVES_TIMEOUT)
      },
    )

    const confirmedPromised = new Promise<TransactionInfo>((resolve) => {
      intervalTimerId = setInterval(async () => {
        try {
          const { data } = await this.axios.get<TransactionInfo>(`/transactions/info/${txId}`)
          clearInterval(intervalTimerId)
          resolve(data)
        } catch (e) { /* empty */ }
      }, 5000)
    })
    return Promise.race([timeoutPromise, confirmedPromised])
      .finally(() => {
        clearInterval(intervalTimerId)
        clearInterval(timeoutTimerId)
      })
  }

  async transfer(address: string, amount: number, assetId?: string) {
    const tx = new TransferTx({
      senderPublicKey: this.walletKeyPair.publicKey,
      amount: Math.round(amount * WEST_DECIMALS),
      assetId: assetId === 'WEST' ? undefined : assetId,
      attachment: '',
      fee: this.nodeConfig.minimumFee[4],
      recipient: address,
    })
    try {
      const res: { id: string } = await this.transactionBroadcaster.broadcast(tx, this.walletKeyPair)
      return res
    } catch (err) {
      logError(
        `Failed to send we transfer #${address} ${(err as Error).message ?? err}`,
        'WeNodeApi',
      )
      throw err
    }
  }
}
