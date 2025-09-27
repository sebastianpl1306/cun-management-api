import { Module } from '@nestjs/common';
import { CursosModule } from './cursos/cursos.module';

@Module({
  imports: [CursosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
