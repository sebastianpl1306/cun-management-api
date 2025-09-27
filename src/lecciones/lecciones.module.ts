import { Module } from '@nestjs/common';
import { LeccionesController } from './lecciones.controller';
import { LeccionesService } from './lecciones.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [LeccionesController],
  providers: [LeccionesService],
  imports: [PrismaModule],
})
export class LeccionesModule {}
