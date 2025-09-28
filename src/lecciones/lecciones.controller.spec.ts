import { Test, TestingModule } from '@nestjs/testing';
import { LeccionesController } from './lecciones.controller';
import { LeccionesService } from './lecciones.service';
import { NotFoundException } from '@nestjs/common';

describe('LeccionesController', () => {
  let controller: LeccionesController;
  let service: LeccionesService;

  const mockLeccionesService = {
    buscarLeccionPorId: jest.fn(),
    buscarPreguntasPorLeccion: jest.fn(),
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
      controllers: [LeccionesController],
      providers: [
        {
          provide: LeccionesService,
          useValue: mockLeccionesService,
        },
      ],
    }).compile();

    controller = module.get<LeccionesController>(LeccionesController);
    service = module.get<LeccionesService>(LeccionesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerPreguntasPorLeccion', () => {
    it('Debería devolver las preguntas de una lección valida', async () => {
      const leccionId = 1;
      mockLeccionesService.buscarPreguntasPorLeccion.mockResolvedValue(
        mockPreguntas,
      );

      const result = await controller.obtenerPreguntasPorLeccion(leccionId);

      expect(result).toEqual(mockPreguntas);
      expect(
        jest.spyOn(service, 'buscarPreguntasPorLeccion'),
      ).toHaveBeenCalledWith(leccionId);
      expect(
        jest.spyOn(service, 'buscarPreguntasPorLeccion'),
      ).toHaveBeenCalledTimes(1);
    });

    it('Debería generar error si no existe la lección', async () => {
      const leccionId = 999;
      const error = new NotFoundException(
        `Lección con ID ${leccionId} no encontrada`,
      );
      mockLeccionesService.buscarPreguntasPorLeccion.mockRejectedValue(error);

      await expect(
        controller.obtenerPreguntasPorLeccion(leccionId),
      ).rejects.toThrow(error);
      expect(
        jest.spyOn(service, 'buscarPreguntasPorLeccion'),
      ).toHaveBeenCalledWith(leccionId);
    });

    it('Debería devolver un arreglo vacía cuando la lección no tenga preguntas', async () => {
      const leccionId = 1;
      mockLeccionesService.buscarPreguntasPorLeccion.mockResolvedValue([]);

      const result = await controller.obtenerPreguntasPorLeccion(leccionId);

      expect(result).toEqual([]);
      expect(
        jest.spyOn(service, 'buscarPreguntasPorLeccion'),
      ).toHaveBeenCalledWith(leccionId);
    });

    it('Deberían devolverse las preguntas barajadas', async () => {
      const leccionId = 1;
      const preguntasMezcladas = [...mockPreguntas].reverse();
      mockLeccionesService.buscarPreguntasPorLeccion.mockResolvedValue(
        preguntasMezcladas,
      );

      const result = await controller.obtenerPreguntasPorLeccion(leccionId);

      expect(result).toEqual(preguntasMezcladas);
      expect(result).toHaveLength(mockPreguntas.length);
      expect(
        jest.spyOn(service, 'buscarPreguntasPorLeccion'),
      ).toHaveBeenCalledWith(leccionId);
    });

    it('No debería exponer la respuesta correcta', async () => {
      const leccionId = 1;
      mockLeccionesService.buscarPreguntasPorLeccion.mockResolvedValue(
        mockPreguntas,
      );

      const result = await controller.obtenerPreguntasPorLeccion(leccionId);

      result.forEach((pregunta) => {
        expect(pregunta).toHaveProperty('id');
        expect(pregunta).toHaveProperty('enunciado');
        expect(pregunta).toHaveProperty('opciones');
        expect(pregunta).not.toHaveProperty('respuestaCorrecta');
      });
    });
  });

  describe('obtenerLeccionPorId', () => {
    it('Debería obtener la leccion con el id valido', async () => {
      const leccionId = 1;
      mockLeccionesService.buscarLeccionPorId.mockResolvedValue(
        mockLecciones[0],
      );

      const result = await controller.obtenerLeccionPorId(leccionId);
      expect(result).toEqual(mockLecciones[0]);
      expect(jest.spyOn(service, 'buscarLeccionPorId')).toHaveBeenCalledTimes(
        1,
      );
      expect(jest.spyOn(service, 'buscarLeccionPorId')).toHaveBeenCalledWith(
        leccionId,
      );
    });
  });
});
