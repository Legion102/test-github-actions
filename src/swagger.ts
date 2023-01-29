import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { BUILD_INFO, SWAGGER_BASE_PATH } from './config'

export function setupSwagger(
  app: INestApplication,
) {
  const options = new DocumentBuilder()
    .setTitle('East leasing rewards emulator')
    .setDescription('East leasing rewards emulator API')
    .setVersion(BUILD_INFO.VERSION)
    .addServer(SWAGGER_BASE_PATH)
    .addServer('/')
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('/docs', app, document)
}
