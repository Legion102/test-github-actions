import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import * as express from 'express'
import { setupSwagger } from './swagger'
import { PORT } from './config'
import { logError } from './utils/log-utils'
import { ApplicationModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const server = express()
  server.disable('x-powered-by')

  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    new ExpressAdapter(server),
    {
      cors: { origin: ['*'], credentials: true },
    },
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  setupSwagger(app)
  await app.listen(PORT)
}

bootstrap().catch((err) => {
  logError(err, err.stack ,'Bootstrap')
  process.exit(1)
})
