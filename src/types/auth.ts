import { AxiosInstance } from 'axios'

export const AUTH_CLIENTS_TOKEN = 'AuthClientsToken'

export type AuthorizedClients = {
  weNodeClient: AxiosInstance,
}
