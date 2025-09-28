import { Test, TestingModule } from '@nestjs/testing';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { NotFoundException } from '@nestjs/common';

describe('CursosController', () => {
  let controller: CursosController;
  let service: CursosService;

  const mockCursosService = {
    buscarCursos: jest.fn(),
    buscarLeccionesPorCurso: jest.fn(),
    buscarCursoPorId: jest.fn(),
  };

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
      controllers: [CursosController],
      providers: [
        {
          provide: CursosService,
          useValue: mockCursosService,
        },
      ],
    }).compile();

    controller = module.get<CursosController>(CursosController);
    service = module.get<CursosService>(CursosService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerCursos', () => {
    it('Debería devolver un arreglo con los cursos', async () => {
      mockCursosService.buscarCursos.mockResolvedValue(mockCursos);

      const result = await controller.obtenerCursos();
      expect(result).toEqual(mockCursos);
      expect(jest.spyOn(service, 'buscarCursos')).toHaveBeenCalledTimes(1);
    });

    it('Debería devolver un arreglo vació si no existe el curso', async () => {
      mockCursosService.buscarCursos.mockResolvedValue([]);

      const result = await controller.obtenerCursos();

      expect(result).toEqual([]);
      expect(jest.spyOn(service, 'buscarCursos')).toHaveBeenCalledTimes(1);
    });
  });

  describe('obtenerLeccionesPorCurso', () => {
    it('Debería devolver las lecciones con el id del curso', async () => {
      const cursoId = 1;
      mockCursosService.buscarLeccionesPorCurso.mockResolvedValue(
        mockLecciones,
      );

      const result = await controller.obtenerLeccionesPorCurso(cursoId);
      expect(result).toEqual(mockLecciones);
      expect(
        jest.spyOn(service, 'buscarLeccionesPorCurso'),
      ).toHaveBeenCalledWith(cursoId);
      expect(
        jest.spyOn(service, 'buscarLeccionesPorCurso'),
      ).toHaveBeenCalledTimes(1);
    });

    it('Debería devolver un arreglo vació si el curso no tiene lecciones', async () => {
      const cursoId = 1;
      mockCursosService.buscarLeccionesPorCurso.mockResolvedValue([]);

      const result = await controller.obtenerLeccionesPorCurso(cursoId);
      expect(result).toEqual([]);
      expect(
        jest.spyOn(service, 'buscarLeccionesPorCurso'),
      ).toHaveBeenCalledWith(cursoId);
      expect(
        jest.spyOn(service, 'buscarLeccionesPorCurso'),
      ).toHaveBeenCalledTimes(1);
    });

    it('Debería generar error si el curso no existe', async () => {
      const cursoId = 99;
      const error = new NotFoundException(
        `Curso con ID ${cursoId} no encontrado`,
      );
      mockCursosService.buscarLeccionesPorCurso.mockRejectedValue(error);

      await expect(
        controller.obtenerLeccionesPorCurso(cursoId),
      ).rejects.toThrow(error);

      expect(
        jest.spyOn(service, 'buscarLeccionesPorCurso'),
      ).toHaveBeenCalledWith(cursoId);
    });
  });

  describe('obtenerCursoPorId', () => {
    it('Debería obtener el curso con el id valido', async () => {
      const cursoId = 1;
      mockCursosService.buscarCursoPorId.mockResolvedValue(mockCursos[0]);

      const result = await controller.obtenerCursoPorId(cursoId);
      expect(result).toEqual(mockCursos[0]);
      expect(jest.spyOn(service, 'buscarCursoPorId')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(service, 'buscarCursoPorId')).toHaveBeenCalledWith(
        cursoId,
      );
    });
  });
});
