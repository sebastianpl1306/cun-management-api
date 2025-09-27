import { Module } from '@nestjs/common';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [PrismaModule],
})
export class CursosModule {}
