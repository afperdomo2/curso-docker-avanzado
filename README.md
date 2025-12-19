# 🐳 Curso Docker Avanzado

Este repositorio contiene ejemplos avanzados de Docker, enfocados en técnicas como builds multistage y el uso de imágenes distroless para crear contenedores más seguros, ligeros y eficientes.

## 🎯 Objetivo

El objetivo de este curso es enseñar conceptos avanzados de Docker, incluyendo:

- 🛠️ Optimización de imágenes mediante builds en múltiples etapas.
- 🔒 Uso de imágenes distroless para minimizar la superficie de ataque y el tamaño de los contenedores.
- 📋 Mejores prácticas para el desarrollo y despliegue de aplicaciones en contenedores.

&nbsp;

## 1. 🏗️ MultiStage

**📝 Descripción**: Este proyecto demuestra el uso de builds multistage en Docker para una aplicación web ASP.NET Core. En un build multistage, se utiliza una imagen base para compilar y preparar la aplicación, y luego se copia el resultado a una imagen más ligera para el runtime, reduciendo el tamaño final de la imagen.

**📏 Optimización de Tamaño**: Usando imágenes Alpine (basadas en Alpine Linux), el tamaño de la imagen se reduce drásticamente. Por ejemplo, cambiando de `dotnet/sdk:8.0` a `dotnet/sdk:8.0-alpine` y `dotnet/runtime:8.0-alpine`, el tamaño pasa de ~857 MB a ~91 MB, destacando la importancia de elegir imágenes base eficientes para optimizar recursos y tiempos de despliegue.

**▶️ Comandos para ejecutar**:

```bash
cd MultiStage
docker build -t multistage .
```

---

&nbsp;

## 2. 🔒 Distroless

**📝 Descripción**: Este proyecto ilustra el uso de imágenes "distroless" en un build multistage para Python. Las imágenes distroless son contenedores que contienen únicamente la aplicación y sus dependencias de runtime, sin gestores de paquetes, shells u otros programas típicos de una distribución Linux estándar.

**❓ ¿Por qué usar distroless?**

- 🔐 **Seguridad**: Reducen la superficie de ataque al no incluir shells o herramientas innecesarias, lo que minimiza vulnerabilidades potenciales.
- 📏 **Tamaño**: Son muy pequeñas (la más pequeña ronda los 2 MiB), comparado con imágenes como Alpine (~5 MiB) o Debian (~124 MiB).
- 🔍 **Eficiencia en escaneos**: Mejoran la relación señal-ruido en escáneres de vulnerabilidades (como CVE), facilitando la identificación de problemas reales.
- 🏷️ **Proveniencia**: Simplifican el establecimiento de la procedencia de los componentes incluidos.

Estas imágenes son recomendadas por Google y utilizadas por proyectos como Kubernetes, Knative y Tekton. Se construyen usando Bazel y se recomiendan para entornos de producción.

En este ejemplo, se usa una etapa de construcción con `python:3-slim` para preparar el entorno, y luego se copia a `gcr.io/distroless/python3` para el runtime.

**▶️ Comandos para ejecutar**:

```bash
cd Distroless
docker build -t distroless .
docker run distroless
```

🐛 Para debugging, puedes usar la variante `:debug` de la imagen distroless, que incluye un shell:

```bash
docker run --entrypoint=sh -ti distroless
```

---

&nbsp;

## 3. 🔍 DockerScan

**📝 Descripción**: Este proyecto demuestra técnicas de escaneo de vulnerabilidades en imágenes Docker, utilizando una aplicación web ASP.NET Core construida con un build multistage. Incluye ejemplos de cómo integrar herramientas de escaneo para identificar CVEs y mejorar la seguridad de los contenedores.

**🌍 Imágenes Multiplataforma**: Este proyecto también ilustra el concepto de imágenes Docker multiplataforma, que permiten ejecutar el contenedor en diferentes arquitecturas de hardware (como AMD64 y ARM64), facilitando despliegues en entornos heterogéneos sin reconstruir manualmente. 🏷️ Para esto se debe activar `Use containerd for pulling and storing images` en las configuraciones de **Docker Desktop**.

**▶️ Comandos para ejecutar**:

```bash
cd DockerScan

# Contruir la imagen

# Opción 1: Construir imagen normal
docker build -t dockerscan .

# Opción 2: Construir imagen multiplataforma
docker build --platform linux/amd64,linux/arm64 -t dockerscan:multi .
```

---

&nbsp;

## 4. 🗂️ Cache

**📝 Descripción**: Este proyecto demuestra el uso de `ARG CACHEBUST=1` en Dockerfiles para controlar la caché de builds. Incluye un contenedor Nginx simple que actualiza paquetes y sirve una página HTML personalizada, mostrando cómo invalidar la caché en capas específicas para forzar reconstrucciones.

**🔧 Uso de `ARG CACHEBUST=1`**:

- `ARG` define una variable de build-time. `CACHEBUST=1` es una técnica para evitar la caché de Docker en instrucciones `RUN` subsiguientes.

**▶️ Comandos para ejecutar**:

```bash
cd Cache

# Creación normal de la imagen
docker build -t testingcache .

# Creación evitando el caché
docker build --no-cache -t testingcache .
```

**📜 Script del Dockerfile con `ARG CACHEBUST=1`**:

```dockerfile
FROM nginx:1.21.6

ARG CACHEBUST=1

RUN apt-get update && apt-get -y upgrade && echo $CACHEBUST > /dev/null
```

---

&nbsp;

## 5. 🧱 Capas

**📝 Descripción**: Este proyecto demuestra el concepto de capas en Docker, donde cada instrucción en el Dockerfile crea una capa nueva. Incluye un contenedor Ubuntu simple que instala dependencias, copia archivos y ejecuta un comando, ilustrando cómo optimizar capas para reducir el tamaño de la imagen y mejorar la eficiencia.

**🔧 Importancia de las Capas**:

- Cada `RUN`, `COPY`, `ADD`, etc., crea una capa que se cachea.
- **Optimización**: Combina comandos en una sola `RUN` y limpia cachés (ej. `rm -rf /var/lib/apt/lists/*`) para evitar capas innecesarias.
- **Beneficios**: Acelera builds reutilizando capas cacheadas, pero capas grandes aumentan el tamaño de la imagen.

**▶️ Comandos para ejecutar**:

```bash
cd Capas
docker build -t capas .
docker run capas
```

**📜 Script del Dockerfile**:

```dockerfile
# Capa 1: Imagen base
FROM ubuntu:latest

# Capa 2: Instalar dependencias necesarias y limpiar caché
RUN apt-get update && apt-get install -y \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Capa 3: Copiar archivos de la aplicación
COPY . /app

# Capa 4: Establecer el directorio de trabajo
CMD ["echo", "Hello, World!"]
```

---

&nbsp;

## 🔧 Conceptos Avanzados

### 🔍 1. Build Context

**📝 ¿Qué es el Build Context?**

El build context es el conjunto de archivos y directorios que Docker envía al daemon de Docker durante el proceso de construcción de una imagen. Por defecto, es el directorio actual (.) donde ejecutas `docker build`, pero puedes especificarlo explícitamente.

**🔧 Por qué importa**:

- **Eficiencia**: Solo los archivos en el context se envían al daemon, evitando transferencias innecesarias de archivos grandes o irrelevantes.
- **Seguridad**: No incluyas archivos sensibles (como .env o claves) en el context, ya que podrían copiarse accidentalmente.
- **Optimización**: Usa `.dockerignore` para excluir archivos no necesarios, reduciendo el tamaño del context y acelerando builds.

**📋 Ejemplo**:

```bash
# Construir desde el directorio actual
docker build -t mi-imagen .

# Construir desde un subdirectorio
docker build -t mi-imagen ./mi-app
```

**💡 Consejos**:

- Mantén el context pequeño y relevante.
- Revisa el `.dockerignore` para excluir logs, node_modules, etc.
- Si el context es grande, considera usar multi-stage builds o volúmenes para optimizar.

---

### 🚫 2. dockerignore

**📝 ¿Qué es .dockerignore?**

El archivo `.dockerignore` funciona como un `.gitignore` para Docker: excluye archivos y directorios del build context, evitando que se envíen al daemon durante `docker build`. Esto acelera builds, reduce el tamaño del context y mejora la seguridad al excluir archivos sensibles.

**🔧 Por qué usarlo**:

- **Eficiencia**: Excluye archivos innecesarios (ej. logs, cachés) para builds más rápidos.
- **Seguridad**: Evita copiar accidentalmente claves, contraseñas o datos sensibles.
- **Optimización**: Reduce el tráfico de red y el uso de disco en el daemon.

**📋 Ejemplos por proyecto**:

A continuación, ejemplos de `.dockerignore` para cada proyecto, basados en sus tecnologías:

**1. 🏗️ MultiStage (.NET)**:

```dockerignore
# .NET specific ignores
bin/
obj/
.vs/
*.user
*.tmp
*.log
logs/
node_modules/
.DS_Store
Thumbs.db
```

**💡 Consejos**:

- Personaliza según tu proyecto; incluye patrones como `*.log`, `node_modules/`, etc.
- Verifica con `docker build --no-cache` para asegurar que no falten archivos necesarios.
- Usa wildcards (*) para patrones amplios.
