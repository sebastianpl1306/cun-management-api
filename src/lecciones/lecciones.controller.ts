import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeccionesService } from './lecciones.service';

@Controller('lecciones')
export class LeccionesController {
  constructor(private readonly leccionesService: LeccionesService) {}

  @ApiTags('Lecciones')
  @ApiOperation({ summary: 'Permite obtener las preguntas por lección' })
  @ApiResponse({ status: 200, description: 'Retornar preguntas' })
  @ApiResponse({ status: 404, description: 'La lección no existe' })
  @Get(':leccionId/preguntas')
  async obtenerPreguntasPorLeccion(
    @Param('leccionId', ParseIntPipe) leccionId: number,
  ) {
    return this.leccionesService.buscarPreguntasPorLeccion(leccionId);
  }
}
