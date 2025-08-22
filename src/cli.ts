import 'reflect-metadata'
import { CommandFactory } from 'nest-commander'
import { CommandModule } from '@/commands/command.module'

async function bootstrap() {
  await CommandFactory.run(CommandModule, {
    serviceErrorHandler: (error: Error | any) => {
      // eslint-disable-next-line no-console
      console.error(error)
      process.exit(1)
    },
    logger: ['error', 'warn'],
  })
}

void bootstrap()
