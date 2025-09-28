import { Test, TestingModule } from '@nestjs/testing';
import { LeccionesService } from './lecciones.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrismaService } from '../../test/setup';
import { NotFoundException } from '@nestjs/common';

describe('LeccionesService', () => {
  let service: LeccionesService;
  let prisma: typeof mockPrismaService;

  const mockLeccion = {
    id: 1,
    nombre: 'Aritmética Básica',
    cursoId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPreguntas = [
    {
      id: 1,
      enunciado: '¿Cuál es el resultado de 2 + 2?',
      opciones: ['3', '4', '5', '6'],
    },
    {
      id: 2,
      enunciado: '¿Cuál es el resultado de 5 × 3?',
      opciones: ['12', '15', '18', '20'],
    },
    {
      id: 3,
      enunciado: '¿Cuál es el resultado de 10 ÷ 2?',
      opciones: ['3', '4', '5', '6'],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeccionesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LeccionesService>(LeccionesService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buscarPreguntasPorLeccion', () => {
    it('Debería devolver las preguntas de la lección', async () => {
      const leccionId = 1;
      prisma.leccion.findUnique.mockResolvedValue(mockLeccion);
      prisma.pregunta.findMany.mockResolvedValue(mockPreguntas);

      const result = await service.buscarPreguntasPorLeccion(leccionId);

      expect(result).toHaveLength(mockPreguntas.length);
      expect(result).toEqual(expect.arrayContaining(mockPreguntas));
      expect(prisma.leccion.findUnique).toHaveBeenCalledWith({
        where: { id: leccionId },
      });
      expect(prisma.pregunta.findMany).toHaveBeenCalledWith({
        where: { leccionId: leccionId },
        select: {
          id: true,
          enunciado: true,
          opciones: true,
        },
      });
    });

    it('Debería generar un error si no se encuentra la lección', async () => {
      const leccionId = 999;
      prisma.leccion.findUnique.mockResolvedValue(null);

      await expect(
        service.buscarPreguntasPorLeccion(leccionId),
      ).rejects.toThrow(
        new NotFoundException(`Lección con ID ${leccionId} no encontrada`),
      );

      expect(prisma.leccion.findUnique).toHaveBeenCalledWith({
        where: { id: leccionId },
      });
      expect(prisma.pregunta.findMany).not.toHaveBeenCalled();
    });

    it('Debería devolver un arreglo vació si la lección no tiene preguntas', async () => {
      const leccionId = 1;
      prisma.leccion.findUnique.mockResolvedValue(mockLeccion);
      prisma.pregunta.findMany.mockResolvedValue([]);

      const result = await service.buscarPreguntasPorLeccion(leccionId);

      expect(result).toEqual([]);
      expect(prisma.leccion.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.pregunta.findMany).toHaveBeenCalledTimes(1);
    });

    it('Debería mezclar las preguntas en diferente orden', async () => {
      const leccionId = 1;
      prisma.leccion.findUnique.mockResolvedValue(mockLeccion);
      prisma.pregunta.findMany.mockResolvedValue(mockPreguntas);

      const originalMathRandom = Math.random;
      Math.random = jest
        .fn()
        .mockReturnValueOnce(0.8)
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.5);

      const result = await service.buscarPreguntasPorLeccion(leccionId);

      expect(result).toHaveLength(mockPreguntas.length);
      expect(result).toEqual(expect.arrayContaining(mockPreguntas));
      Math.random = originalMathRandom;
    });
  });

  describe('mezclarArreglo', () => {
    it('Debería devolver una matriz con los mismos elementos pero con un orden diferente.', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const mezclado = service['mezclarArreglo'](originalArray);

      expect(mezclado).toHaveLength(originalArray.length);
      expect(mezclado).toEqual(expect.arrayContaining(originalArray));
      expect(mezclado).not.toBe(originalArray);
    });

    it('Debería poder recibir una matriz vacía', () => {
      const result = service['mezclarArreglo']([]);
      expect(result).toEqual([]);
    });
  });

  describe('buscarLeccionPorId', () => {
    it('Debería devolver una lección con un id valido', async () => {
      const leccionId = 1;
      prisma.leccion.findUnique.mockResolvedValue(mockLeccion);

      const result = await service.buscarLeccionPorId(leccionId);
      expect(result).toEqual(mockLeccion);
      expect(prisma.leccion.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.leccion.findUnique).toHaveBeenCalledWith({
        where: { id: leccionId },
      });
    });
  });
});
