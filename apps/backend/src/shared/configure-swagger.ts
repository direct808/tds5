import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

/**
 * Configures Swagger UI and returns the generated OpenAPI document.
 */
export function configureSwagger(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания трафика')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, { swaggerOptions: {} })

  return document
}
