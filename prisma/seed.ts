import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.pregunta.deleteMany();
  await prisma.leccion.deleteMany();
  await prisma.curso.deleteMany();

  // Crear cursos
  const cursoMath = await prisma.curso.create({
    data: {
      nombre: 'Matemáticas Básicas',
      descripcion:
        'Curso introductorio de matemáticas con operaciones básicas y álgebra.',
    },
  });

  const cursoHistory = await prisma.curso.create({
    data: {
      nombre: 'Historia Mundial',
      descripcion:
        'Recorrido por los principales eventos de la historia mundial.',
    },
  });

  // Crear lecciones para Matemáticas
  const leccionAritmetica = await prisma.leccion.create({
    data: {
      nombre: 'Aritmética Básica',
      cursoId: cursoMath.id,
    },
  });

  const leccionAlgebra = await prisma.leccion.create({
    data: {
      nombre: 'Introducción al Álgebra',
      cursoId: cursoMath.id,
    },
  });

  // Crear lecciones para Historia
  const leccionAntiguedad = await prisma.leccion.create({
    data: {
      nombre: 'Civilizaciones Antiguas',
      cursoId: cursoHistory.id,
    },
  });

  const leccionEdadMedia = await prisma.leccion.create({
    data: {
      nombre: 'Edad Media',
      cursoId: cursoHistory.id,
    },
  });

  // Crear preguntas para Aritmética
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál es el resultado de 15 + 27?',
        opciones: ['40', '42', '43', '45'],
        respuestaCorrecta: '42',
        leccionId: leccionAritmetica.id,
      },
      {
        enunciado: '¿Cuál es el resultado de 8 × 7?',
        opciones: ['54', '56', '58', '60'],
        respuestaCorrecta: '56',
        leccionId: leccionAritmetica.id,
      },
      {
        enunciado: '¿Cuál es el resultado de 144 ÷ 12?',
        opciones: ['10', '11', '12', '13'],
        respuestaCorrecta: '12',
        leccionId: leccionAritmetica.id,
      },
    ],
  });

  // Crear preguntas para Álgebra
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: 'Si x + 5 = 12, ¿cuál es el valor de x?',
        opciones: ['5', '6', '7', '8'],
        respuestaCorrecta: '7',
        leccionId: leccionAlgebra.id,
      },
      {
        enunciado: '¿Cuál es el resultado de 2x cuando x = 3?',
        opciones: ['5', '6', '7', '8'],
        respuestaCorrecta: '6',
        leccionId: leccionAlgebra.id,
      },
    ],
  });

  // Crear preguntas para Civilizaciones Antiguas
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿En qué continente se desarrolló la civilización egipcia?',
        opciones: ['Asia', 'África', 'Europa', 'América'],
        respuestaCorrecta: 'África',
        leccionId: leccionAntiguedad.id,
      },
      {
        enunciado: '¿Cuál era la capital del Imperio Romano?',
        opciones: ['Atenas', 'Esparta', 'Roma', 'Cartago'],
        respuestaCorrecta: 'Roma',
        leccionId: leccionAntiguedad.id,
      },
      {
        enunciado: '¿Qué civilización construyó las pirámides de Giza?',
        opciones: ['Griegos', 'Romanos', 'Egipcios', 'Persas'],
        respuestaCorrecta: 'Egipcios',
        leccionId: leccionAntiguedad.id,
      },
    ],
  });

  // Crear preguntas para Edad Media
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿En qué siglo comenzó aproximadamente la Edad Media?',
        opciones: ['Siglo III', 'Siglo V', 'Siglo VII', 'Siglo IX'],
        respuestaCorrecta: 'Siglo V',
        leccionId: leccionEdadMedia.id,
      },
      {
        enunciado:
          '¿Cómo se llamaba el sistema económico predominante en la Edad Media?',
        opciones: ['Capitalismo', 'Socialismo', 'Feudalismo', 'Mercantilismo'],
        respuestaCorrecta: 'Feudalismo',
        leccionId: leccionEdadMedia.id,
      },
    ],
  });

  console.log('Datos de prueba insertados correctamente');
}

main().catch((e) => {
  console.error('Error al insertar datos:', e);
  process.exit(1);
});
