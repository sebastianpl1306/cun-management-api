import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('cursos')
export class CursosController {
  constructor(private cursosService: CursosService) {}

  @ApiTags('Cursos')
  @ApiOperation({ summary: 'Permite obtener la lista de todos los cursos' })
  @ApiResponse({ status: 200, description: 'Retornar todas los cursos' })
  @Get()
  async obtenerCursos() {
    return this.cursosService.buscarCursos();
  }

  @ApiTags('Cursos')
  @ApiOperation({
    summary: 'Permite obtener la lista de las lecciones por curso',
  })
  @ApiResponse({ status: 200, description: 'Retornar lecciones' })
  @ApiResponse({ status: 404, description: 'Error curso no encontrado' })
  @Get(':cursoId/lecciones')
  async obtenerLeccionesPorCurso(
    @Param('cursoId', ParseIntPipe) cursoId: number,
  ) {
    return this.cursosService.buscarLeccionesPorCurso(cursoId);
  }
}
