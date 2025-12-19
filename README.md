# 🐳 Curso Docker Avanzado

Este repositorio contiene ejemplos avanzados de Docker, enfocados en técnicas como builds multistage y el uso de imágenes distroless para crear contenedores más seguros, ligeros y eficientes.

## 🎯 Objetivo

El objetivo de este curso es enseñar conceptos avanzados de Docker, incluyendo:

- 🛠️ Optimización de imágenes mediante builds en múltiples etapas.
- 🔒 Uso de imágenes distroless para minimizar la superficie de ataque y el tamaño de los contenedores.
- 📋 Mejores prácticas para el desarrollo y despliegue de aplicaciones en contenedores.

## 1. 🏗️ MultiStage

**📝 Descripción**: Este proyecto demuestra el uso de builds multistage en Docker para una aplicación web ASP.NET Core. En un build multistage, se utiliza una imagen base para compilar y preparar la aplicación, y luego se copia el resultado a una imagen más ligera para el runtime, reduciendo el tamaño final de la imagen.

**▶️ Comandos para ejecutar**:

```bash
cd MultiStage
docker build -t multistage .
```

🌐 Accede a la aplicación en `http://localhost:8080/swagger` para ver la documentación interactiva de la API.

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

🌐 Accede a la aplicación en `http://localhost:8081/swagger` para ver la documentación interactiva de la API.

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

RUN echo '<html><body><h1>Hola, Mundo desde NGINX en Docker!</h1></body></html>' > /usr/share/nginx/html/index.html
```
