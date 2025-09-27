import { Test, TestingModule } from '@nestjs/testing';
import { CursosService } from './cursos.service';
import { mockPrismaService } from '../../test/setup';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CursosService', () => {
  let service: CursosService;
  let prisma: typeof mockPrismaService;

  const mockCursos = [
    {
      id: 1,
      nombre: 'Matemáticas Básicas',
      descripcion: 'Curso de matemáticas',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      nombre: 'Historia Mundial',
      descripcion: 'Curso de historia',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockLecciones = [
    {
      id: 1,
      nombre: 'Aritmética Básica',
      cursoId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      nombre: 'Álgebra',
      cursoId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buscarCursos', () => {
    it('debería devolver un arreglo con los cursos', async () => {
      prisma.curso.findMany.mockResolvedValue(mockCursos);

      const result = await service.buscarCursos();
      expect(result).toEqual(mockCursos);
      expect(prisma.curso.findMany).toHaveBeenCalledTimes(1);
    });

    it('Debería devolver un arreglo vació cuando no existan cursos', async () => {
      prisma.curso.findMany.mockResolvedValue([]);
      const result = await service.buscarCursos();
      expect(result).toEqual([]);
      expect(prisma.curso.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('buscarLeccionesPorCurso', () => {
    it('Debería devolver las lecciones del curso existente', async () => {
      const cursoId = 1;
      prisma.curso.findUnique.mockResolvedValue(mockCursos[0]);
      prisma.leccion.findMany.mockResolvedValue(mockLecciones);

      const result = await service.buscarLeccionesPorCurso(cursoId);
      expect(result).toEqual(mockLecciones);
      expect(prisma.curso.findUnique).toHaveBeenCalledWith({
        where: { id: cursoId },
      });
      expect(prisma.leccion.findMany).toHaveBeenCalledWith({
        where: { cursoId: cursoId },
      });
    });

    it('Debería mandar un error si el curso no existe', async () => {
      const cursoId = 999;
      prisma.curso.findUnique.mockResolvedValue(null);

      await expect(service.buscarLeccionesPorCurso(cursoId)).rejects.toThrow(
        new NotFoundException(`Curso con ID ${cursoId} no encontrado`),
      );
      expect(prisma.curso.findUnique).toHaveBeenCalledWith({
        where: { id: cursoId },
      });
      expect(prisma.leccion.findMany).not.toHaveBeenCalled();
    });

    it('Debería devolver un arreglo vació si no existen lecciones', async () => {
      const cursoId = 1;
      prisma.curso.findUnique.mockResolvedValue(mockCursos[0]);
      prisma.leccion.findMany.mockResolvedValue([]);

      const result = await service.buscarLeccionesPorCurso(cursoId);
      expect(result).toEqual([]);
      expect(prisma.curso.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.leccion.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
