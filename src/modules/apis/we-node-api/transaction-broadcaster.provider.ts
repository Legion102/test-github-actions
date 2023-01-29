import { NodeConfig } from '../../../types/we-node'
import { NODE_CONFIG, TRANSACTION_BROADCASTER } from '../../../types/constants'
import { AUTH_CLIENTS_TOKEN, AuthorizedClients } from '../../../types/auth'
import { WE_NODE_ADDRESS } from '../../../config'
import { TransactionBroadcaster } from '@wavesenterprise/voting-blockchain-tools/transactions'
import { GostSignature } from '@wavesenterprise/voting-blockchain-tools/node/signature/gost'
import { WavesSignature } from '@wavesenterprise/voting-blockchain-tools/node/signature/waves'

export const transactionBroadcasterProvider = {
  provide: TRANSACTION_BROADCASTER,
  useFactory: (
    authClients: AuthorizedClients,
    nodeConfig: NodeConfig,
  ) => {
    return new TransactionBroadcaster({
      nodeAddress: WE_NODE_ADDRESS,
      signModule: nodeConfig.gostCrypto ? GostSignature : WavesSignature,
      axiosInstance: authClients.weNodeClient,
    })
  },
  inject: [AUTH_CLIENTS_TOKEN, NODE_CONFIG],
}
