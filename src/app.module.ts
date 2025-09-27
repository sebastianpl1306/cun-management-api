import { Module } from '@nestjs/common';
import { CursosModule } from './cursos/cursos.module';
import { LeccionesModule } from './lecciones/lecciones.module';

@Module({
  imports: [CursosModule, LeccionesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
