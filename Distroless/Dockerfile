# 🐳 Dockerfile Multistage con Imagen Distroless para Python
# Este Dockerfile utiliza un build en múltiples etapas para crear una imagen segura y ligera.
# La primera etapa prepara el entorno de construcción, y la segunda usa una imagen distroless.

# Etapa de construcción: Usamos una imagen base con Python para preparar el entorno
FROM python:3-slim AS build-env
COPY . /app
WORKDIR /app

# Etapa final: Usamos una imagen distroless (sin shell ni paquetes innecesarios) para mayor seguridad
FROM gcr.io/distroless/python3
# Copiamos los archivos preparados desde la etapa de construcción al contenedor final
COPY --from=build-env /app /app
# Establecemos el directorio de trabajo en /app
WORKDIR /app

# Comando para ejecutar el script hello.py, pasando /etc como argumento
CMD ["hello.py", "/etc"]