import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluarRespuestaDto } from './dto/evaluar-respuesta.dto';

@Injectable()
export class EvaluarService {
  constructor(private prisma: PrismaService) {}

  async evaluarRespuesta(evaluarRespuestaDto: EvaluarRespuestaDto) {
    const { preguntaId, respuestaUsuario } = evaluarRespuestaDto;

    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id: preguntaId },
      select: {
        id: true,
        enunciado: true,
        respuestaCorrecta: true,
      },
    });

    if (!pregunta) {
      throw new NotFoundException(
        `Pregunta con ID ${preguntaId} no encontrada`,
      );
    }

    const respuestaCorrecta = pregunta.respuestaCorrecta.trim().toLowerCase();
    const respuestaUsuarioNormalizada = respuestaUsuario.trim().toLowerCase();

    const esCorrecta = respuestaCorrecta === respuestaUsuarioNormalizada;

    return {
      preguntaId: pregunta.id,
      respuestaUsuario,
      esCorrecta,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      mensaje: esCorrecta ? '¡Correcto!' : 'Respuesta incorrecta',
    };
  }
}
