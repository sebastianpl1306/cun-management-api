import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EvaluarService } from './evaluar.service';
import { mockPrismaService } from '../../test/setup';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluarRespuestaDto } from './dto/evaluar-respuesta.dto';

describe('EvaluarService', () => {
  let service: EvaluarService;
  let prisma: typeof mockPrismaService;

  const mockPregunta = {
    id: 1,
    enunciado: '¿Cuál es el resultado de 2 + 2?',
    respuestaCorrecta: '4',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluarService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EvaluarService>(EvaluarService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluarRespuesta', () => {
    it('Debería devolver la evaluación correspondiente a la respuesta es correcta', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '4',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPregunta);

      const result = await service.evaluarRespuesta(dto);

      expect(result).toEqual({
        preguntaId: 1,
        respuestaUsuario: '4',
        esCorrecta: true,
        respuestaCorrecta: '4',
        mensaje: '¡Correcto!',
      });

      expect(prisma.pregunta.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          enunciado: true,
          respuestaCorrecta: true,
        },
      });
    });

    it('Debería devolver la evaluación correspondiente a la respuesta es incorrecta', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '5',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPregunta);

      const result = await service.evaluarRespuesta(dto);

      expect(result).toEqual({
        preguntaId: 1,
        respuestaUsuario: '5',
        esCorrecta: false,
        respuestaCorrecta: '4',
        mensaje: 'Respuesta incorrecta',
      });
    });

    it('Debería manejar comparaciones que no distingan entre mayúsculas y minúsculas', async () => {
      const mockPreguntaTexto = {
        id: 2,
        enunciado: '¿Cuál es la capital de Francia?',
        respuestaCorrecta: 'París',
      };

      const dto: EvaluarRespuestaDto = {
        preguntaId: 2,
        respuestaUsuario: 'PARÍS',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPreguntaTexto);

      const result = await service.evaluarRespuesta(dto);

      expect(result.esCorrecta).toBe(true);
      expect(result.mensaje).toBe('¡Correcto!');
    });

    it('Debería manejar espacios adicionales en las respuestas', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '  4  ',
      };

      prisma.pregunta.findUnique.mockResolvedValue({
        ...mockPregunta,
        respuestaCorrecta: '  4  ',
      });

      const result = await service.evaluarRespuesta(dto);

      expect(result.esCorrecta).toBe(true);
    });

    it('Debería generar error cuando la pregunta no exista', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 999,
        respuestaUsuario: '4',
      };

      prisma.pregunta.findUnique.mockResolvedValue(null);

      await expect(service.evaluarRespuesta(dto)).rejects.toThrow(
        new NotFoundException('Pregunta con ID 999 no encontrada'),
      );

      expect(prisma.pregunta.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        select: {
          id: true,
          enunciado: true,
          respuestaCorrecta: true,
        },
      });
    });

    it('Debería manejar respuestas cuando estén vacías', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPregunta);

      const result = await service.evaluarRespuesta(dto);

      expect(result.esCorrecta).toBe(false);
      expect(result.mensaje).toBe('Respuesta incorrecta');
    });

    it('Debería devolver la estructura completa del objeto de respuesta', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '4',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPregunta);

      const result = await service.evaluarRespuesta(dto);

      expect(result).toHaveProperty('preguntaId');
      expect(result).toHaveProperty('respuestaUsuario');
      expect(result).toHaveProperty('esCorrecta');
      expect(result).toHaveProperty('respuestaCorrecta');
      expect(result).toHaveProperty('mensaje');
      expect(typeof result.esCorrecta).toBe('boolean');
    });
  });

  describe('Casos adicionales', () => {
    it('Debería manejar caracteres especiales en las respuestas', async () => {
      const mockPreguntaEspecial = {
        id: 5,
        enunciado: '¿Cuál es el símbolo del euro?',
        respuestaCorrecta: '€',
      };

      const dto: EvaluarRespuestaDto = {
        preguntaId: 5,
        respuestaUsuario: '€',
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPreguntaEspecial);

      const result = await service.evaluarRespuesta(dto);

      expect(result.esCorrecta).toBe(true);
    });

    it('Debería manejar respuestas muy largas', async () => {
      const longAnswer = 'A'.repeat(1000);
      const mockPreguntaLarga = {
        id: 6,
        enunciado: 'Pregunta larga',
        respuestaCorrecta: longAnswer,
      };

      const dto: EvaluarRespuestaDto = {
        preguntaId: 6,
        respuestaUsuario: longAnswer,
      };

      prisma.pregunta.findUnique.mockResolvedValue(mockPreguntaLarga);

      const result = await service.evaluarRespuesta(dto);

      expect(result.esCorrecta).toBe(true);
    });
  });
});
