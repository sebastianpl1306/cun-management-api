import { Module } from '@nestjs/common';
import { EvaluarService } from './evaluar.service';
import { EvaluarController } from './evaluar.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [EvaluarService],
  controllers: [EvaluarController],
  imports: [PrismaModule],
})
export class EvaluarModule {}
