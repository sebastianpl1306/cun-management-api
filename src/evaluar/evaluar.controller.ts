import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EvaluarService } from './evaluar.service';
import { EvaluarRespuestaDto } from './dto/evaluar-respuesta.dto';

@Controller('api/evaluar')
export class EvaluarController {
  constructor(private evaluarService: EvaluarService) {}

  @ApiTags('Evaluar')
  @ApiOperation({ summary: 'Permite evaluar las respuestas del usuario' })
  @Post('')
  async evaluarRespuesta(@Body() evaluarRespuestaDto: EvaluarRespuestaDto) {
    return this.evaluarService.evaluarRespuesta(evaluarRespuestaDto);
  }
}
