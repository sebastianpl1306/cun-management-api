import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EvaluarRespuestaDto {
  @ApiProperty({ description: 'ID de la pregunta a evaluar', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  preguntaId: number;

  @ApiProperty({ description: 'Respuesta del usuario', example: '20' })
  @IsString()
  @IsNotEmpty()
  respuestaUsuario: string;
}
