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
