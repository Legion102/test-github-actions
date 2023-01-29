import { NODE_CONFIG } from '../../../types/constants'
import { AUTH_CLIENTS_TOKEN, AuthorizedClients } from '../../../types/auth'
import { NodeConfig } from '../../../types/we-node'
import { logError } from '../../../utils/log-utils'

export const nodeConfigProvider = {
  provide: NODE_CONFIG,
  useFactory: async (
    authClients: AuthorizedClients,
  ) => {
    try {
      const { data } = await authClients.weNodeClient.get<NodeConfig>('/node/config')
      return data
    }
    catch (err) {
      logError(`Cant get node config: ${(err as Error).message}`, (err as Error).stack, 'NodeConfigProvider')
      process.exit(2)
    }
  },
  inject: [AUTH_CLIENTS_TOKEN],
}
