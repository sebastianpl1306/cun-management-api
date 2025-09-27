import { Test, TestingModule } from '@nestjs/testing';
import { EvaluarController } from './evaluar.controller';
import { EvaluarService } from './evaluar.service';
import { EvaluarRespuestaDto } from './dto/evaluar-respuesta.dto';

describe('EvaluarController', () => {
  let controller: EvaluarController;
  let service: EvaluarService;

  const mockEvaluacionService = {
    evaluarRespuesta: jest.fn(),
  };

  const mockEvaluationResult = {
    preguntaId: 1,
    respuestaUsuario: '4',
    esCorrecta: true,
    respuestaCorrecta: '4',
    mensaje: '¡Correcto!',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluarController],
      providers: [
        {
          provide: EvaluarService,
          useValue: mockEvaluacionService,
        },
      ],
    }).compile();

    controller = module.get<EvaluarController>(EvaluarController);
    service = module.get<EvaluarService>(EvaluarService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('evaluarRespuesta', () => {
    it('Debería devolver el resultado para la respuesta correcta', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '4',
      };

      mockEvaluacionService.evaluarRespuesta.mockResolvedValue(
        mockEvaluationResult,
      );

      const result = await controller.evaluarRespuesta(dto);

      expect(result).toEqual(mockEvaluationResult);
      expect(jest.spyOn(service, 'evaluarRespuesta')).toHaveBeenCalledWith(dto);
      expect(jest.spyOn(service, 'evaluarRespuesta')).toHaveBeenCalledTimes(1);
    });

    it('Debería devolver el resultado para la respuesta incorrecta', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 1,
        respuestaUsuario: '5',
      };

      const incorrectResult = {
        ...mockEvaluationResult,
        respuestaUsuario: '5',
        esCorrecta: false,
        mensaje: 'Respuesta incorrecta',
      };

      mockEvaluacionService.evaluarRespuesta.mockResolvedValue(incorrectResult);

      const result = await controller.evaluarRespuesta(dto);

      expect(result).toEqual(incorrectResult);
      expect(result.esCorrecta).toBe(false);
      expect(jest.spyOn(service, 'evaluarRespuesta')).toHaveBeenCalledWith(dto);
    });

    it('Debería pasar DTO correctamente al servicio', async () => {
      const dto: EvaluarRespuestaDto = {
        preguntaId: 42,
        respuestaUsuario: 'Respuesta de prueba',
      };

      mockEvaluacionService.evaluarRespuesta.mockResolvedValue({
        ...mockEvaluationResult,
        preguntaId: 42,
        respuestaUsuario: 'Respuesta de prueba',
      });

      await controller.evaluarRespuesta(dto);

      expect(jest.spyOn(service, 'evaluarRespuesta')).toHaveBeenCalledWith({
        preguntaId: 42,
        respuestaUsuario: 'Respuesta de prueba',
      });
    });
  });
});
