import { Module } from '@nestjs/common';
import { MainModule } from './main/main.module';
import { AgentModule } from './agent/agent.module';
import { TokenModule } from './token/token.module';
import { EntryModule } from './entry/entry.module';

@Module({
  imports: [MainModule, AgentModule, TokenModule, EntryModule]
})
export class AppModule {}
