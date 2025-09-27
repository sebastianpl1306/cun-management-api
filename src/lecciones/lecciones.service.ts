import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeccionesService {
  constructor(private prisma: PrismaService) {}

  async buscarPreguntasPorLeccion(leccionId: number) {
    const leccion = await this.prisma.leccion.findUnique({
      where: { id: leccionId },
    });

    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${leccionId} no encontrada`);
    }

    const preguntas = await this.prisma.pregunta.findMany({
      where: {
        leccionId: leccionId,
      },
      select: {
        id: true,
        enunciado: true,
        opciones: true,
      },
    });

    return this.mezclarArreglo(preguntas);
  }

  private mezclarArreglo<T>(array: T[]): T[] {
    const mezcla = [...array];
    for (let i = mezcla.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezcla[i], mezcla[j]] = [mezcla[j], mezcla[i]];
    }
    return mezcla;
  }
}
