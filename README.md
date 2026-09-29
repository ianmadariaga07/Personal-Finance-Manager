# Personal-Finance-Manager

## Requisitos Previos
Antes de levantar la infraestructura y los servidores, asegúrate de tener instaladas las siguientes herramientas en tu entorno local de desarrollo:

- **Node.js** (v18 o superior): Entorno de ejecución base para ambos proyectos (Frontend y Backend).
- **Docker y Docker Compose**: Indispensables para levantar nuestra base de datos por medio de contenedores sin requerir instalaciones locales de PostgreSQL.
- **Angular CLI**: Instálalo globalmente en tu equipo ejecutando:
  ```bash
  npm install -g @angular/cli
  ```
- **NestJS CLI**: Instálalo globalmente en tu equipo ejecutando:
  ```bash
  npm install -g @nestjs/cli
  ```

> **NOTA:**
> Tener las CLIs de Angular y NestJS instaladas de forma global te permitirá ejecutar comandos como `ng serve` o `nest start` directamente desde cualquier terminal sin que el sistema operativo te arroje errores

---

## Paso 1: Levantar la Infraestructura (Base de Datos)

Para garantizar tener exactamente la misma versión de la base de datos sin lidiar con instalaciones manuales, utilizamos Docker.

1. Abre una terminal y navega hacia la carpeta del backend (`nexus-server`). Aquí es donde reside nuestro archivo de orquestación (`docker-compose.yml`):
   ```bash
   cd nexus-server
   ```

2. Levanta los contenedores en segundo plano ejecutando el siguiente comando:
   ```bash
   docker-compose up -d
   ```

> **Nota de Entorno y Seguridad:**
> Este comando inicializa nuestro motor de PostgreSQL en el puerto `5432` y levanta pgAdmin (la interfaz visual) en `http://localhost:5050`.
>
> Para entrar a pgAdmin y administrar las tablas localmente, utiliza estas credenciales:
> - **Email:** `admin@nexus.com`
> - **Password:** `admin123`

---

## Paso 2: Levantar el Backend (NestJS)

El servidor centraliza nuestras reglas de negocio financieras (cálculo de Total Real vs Total App) y se conecta a la base de datos PostgreSQL que acabamos de levantar.

1. Asegúrate de estar dentro de la carpeta del backend (`nexus-server`). Si acabas de ejecutar el paso anterior, ya deberías estar ahí.

2. Instala todas las dependencias del proyecto de Node.js:
   ```bash
   npm install
   ```

3. Inicia el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

> **Nota de Entorno:**
> El backend estará escuchando peticiones en `http://localhost:3000`.

## Paso 3: Levantar el Frontend (Angular)

El cliente web es una Single Page Application (SPA) construida en Angular 21 que consumirá nuestra API de NestJS de forma segura.

1. Abre una **nueva pestaña o ventana** en tu terminal (es crucial no interrumpir ni cerrar el proceso de la terminal donde está corriendo el backend).

2. Navega hacia la carpeta del cliente:
   ```bash
   cd nexus-web
   ```

3. Instala las dependencias de la interfaz (Angular, PrimeNG, Tailwind CSS, etc.):
   ```bash
   npm install
   ```

4. Compila y levanta la aplicación en modo desarrollo:
   ```bash
   ng serve
   ```

> **Nota de Entorno:**
> El frontend estará disponible en `http://localhost:4200`. Al abrir esta URL en tu navegador, la aplicación interceptará automáticamente que no hay una sesión activa y te redirigirá a la pantalla de Login.
>

