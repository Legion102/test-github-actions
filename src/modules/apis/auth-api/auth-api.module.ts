import { Module } from '@nestjs/common'
import { AUTH_CLIENTS_TOKEN } from '../../../types/auth'
import { authorizedClientsProvider } from './authorized-clients.provider'

@Module({
  imports: [],
  providers: [
    authorizedClientsProvider,
  ],
  exports: [AUTH_CLIENTS_TOKEN],
})

export class AuthApiModule {
}
