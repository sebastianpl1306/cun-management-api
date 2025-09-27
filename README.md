## Tecnologías utilizadas

- **Node.js** con **TypeScript**
- **NestJS** - Framework para construir aplicaciones Node.js escalables
- **Prisma** - ORM moderno para TypeScript y Node.js
- **PostgreSQL** - Base de datos relacional

## Modelo de Datos

### Curso
- `id`: Identificador único
- `nombre`: Nombre del curso
- `descripcion`: Descripción del curso

### Leccion
- `id`: Identificador único
- `nombre`: Nombre de la lección
- `cursoId`: ID del curso al que pertenece

### Pregunta
- `id`: Identificador único
- `enunciado`: Texto de la pregunta
- `opciones`: Array de opciones de respuesta
- `respuestaCorrecta`: Respuesta correcta
- `leccionId`: ID de la lección a la que pertenece

## Instalación y configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio y instalar dependencias:**
```bash
npm install
```

2. **Configurar la base de datos:**
  - Copiar el archivo `.env` y configurar la URL de conexión:
```bash
DATABASE_URL="postgresql://adminCun:Cun2024!@localhost:5499/cundb"
PORT=3000
```

3. **Ejecutar las migraciones de Prisma:**
```bash
npx prisma generate
npx prisma db push
```

4. **Poblar la base de datos con datos de prueba:**
```bash
npm run prisma:seed
```

5. **Iniciar el servidor:**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000`


### Pasos de instalación con docker

1. **Configurar la base de datos:**
  - Copiar el archivo `.env` y configurar la URL de conexión:
```bash
DATABASE_URL="postgresql://adminCun:Cun2024!@db:5432/cundb"
PORT=3000
```

2. **Ejecutar el comando para crear y arrancar el contenedor:**
```bash
docker compose up -d
```

La API estará disponible en `http://localhost:3000`