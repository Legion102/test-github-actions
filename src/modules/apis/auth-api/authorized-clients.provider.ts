import axios from 'axios'
import { AUTH_CLIENTS_TOKEN, AuthorizedClients } from '../../../types/auth'
import { WE_NODE_ADDRESS, WE_NODE_API_KEY } from '../../../config'

export const authorizedClientsProvider = {
  provide: AUTH_CLIENTS_TOKEN,
  useFactory: (): AuthorizedClients => {
    const nodeClient = axios.create({
      baseURL: WE_NODE_ADDRESS,
    })
    if (WE_NODE_API_KEY) {
      nodeClient.interceptors.request.use((config) => {
        config.headers ??= {}
        config.headers['X-API-Key'] ??= WE_NODE_API_KEY
        return config
      })
    }
    return {
      weNodeClient: nodeClient,
    }
  },
}
