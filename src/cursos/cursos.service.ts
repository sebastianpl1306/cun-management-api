import { Injectable, NotFoundException } from '@nestjs/common';
import { Curso } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CursosService {
  constructor(private prismaService: PrismaService) {}

  async buscarCursos(): Promise<Curso[]> {
    return await this.prismaService.curso.findMany();
  }

  async buscarCursoPorId(id: number): Promise<Curso> {
    const curso = await this.prismaService.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    return curso;
  }

  async buscarLeccionesPorCurso(cursoId: number) {
    const curso = await this.prismaService.curso.findUnique({
      where: { id: cursoId },
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
    }

    return this.prismaService.leccion.findMany({
      where: {
        cursoId,
      },
    });
  }
}
