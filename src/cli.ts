import 'reflect-metadata'
import { CommandFactory } from 'nest-commander'
import { CommandModule } from '@/commands/command.module'

async function bootstrap() {
  await CommandFactory.run(CommandModule, {
    logger: ['error', 'warn'],
  })
}

void bootstrap()
