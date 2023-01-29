import { NodeConfig } from '../../../types/we-node'
import { NODE_CONFIG, SEED_MANAGER } from '../../../types/constants'
import { SeedManager } from '@wavesenterprise/voting-blockchain-tools/node/seed/common'
import { WavesNodeCrypto } from '@wavesenterprise/voting-blockchain-tools/node/seed/waves'
import { GostCrypto } from '@wavesenterprise/voting-blockchain-tools/node/seed/gost'

export const seedManagerProvider = {
  provide: SEED_MANAGER,
  useFactory: (
    nodeConfig: NodeConfig,
  ) => {
    return new SeedManager({
      networkByte: nodeConfig.chainId.charCodeAt(0),
      keysModule: nodeConfig.gostCrypto ? GostCrypto : WavesNodeCrypto,
    })
  },
  inject: [NODE_CONFIG],
}
