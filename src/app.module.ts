import { Module } from '@nestjs/common';
import { CursosModule } from './cursos/cursos.module';
import { LeccionesModule } from './lecciones/lecciones.module';
import { EvaluarModule } from './evaluar/evaluar.module';

@Module({
  imports: [CursosModule, LeccionesModule, EvaluarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
