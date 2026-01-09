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

## 6. 👤 Usuarios

**📝 Descripción**: Este proyecto demuestra el uso de usuarios no root en contenedores Docker para mejorar la seguridad. Se crea un grupo y un usuario específico, se cambian los permisos necesarios, y se ejecuta el contenedor con el usuario no privilegiado, evitando riesgos asociados al uso de root.

**🔒 Seguridad**: Ejecutar procesos como root en contenedores puede aumentar la superficie de ataque. Usar un usuario dedicado limita los permisos y mejora la seguridad.

**▶️ Comandos para ejecutar**:

```bash
cd Usuarios
docker build -t usuarios .
docker run usuarios
```

**📜 Script del Dockerfile**:

```dockerfile
# Utilizar nginx versión 1.29 como imagen base
FROM nginx:1.29

# Actualizar y mejorar los paquetes del sistema
RUN apt-get update && apt-get -y upgrade

# Crear un nuevo grupo y usuario para ejecutar el contenedor
RUN groupadd -r user_group && useradd -r -g user_group felipe_user
# Cambiar la propiedad de /usr/share al nuevo usuario
RUN chown -R felipe_user:user_group /usr/share
# Cambiar al usuario no root
USER felipe_user

# ❌ No se puede ejecutar este comando porque requiere permisos de superusuario
# RUN apt-get update && apt-get -y upgrade

# Comando a ejecutar cuando el contenedor inicie
CMD ["bash", "-c", "echo 'Hola, soy Felipe'"]
```

---

&nbsp;

## 7. ⚖️ BalanceadorCarga

**📝 Descripción**: Este proyecto demuestra el uso de Docker Compose para orquestar múltiples contenedores y configurar un balanceador de carga con Nginx. Incluye un proxy inverso que distribuye las solicitudes entre tres servidores backend, ilustrando cómo crear una arquitectura escalable y resiliente usando Docker Compose y redes personalizadas.

**🌐 Arquitectura**:

La arquitectura consta de cuatro componentes principales:

- **Proxy (Nginx)**: Actúa como balanceador de carga, distribuyendo las solicitudes entre los tres servidores backend usando la técnica de "round-robin" (distribución equitativa).
- **Backend 1, 2 y 3**: Tres servidores Nginx independientes que sirven contenido distintivo, permitiendo verificar que las solicitudes se distribuyen entre ellos.
- **Red personalizada (app-network)**: Todos los servicios se conectan a una red bridge personalizada que permite la comunicación interna entre contenedores usando los nombres de los servicios como hostnames.

**🔧 Conceptos clave**:

1. **Docker Compose**: Herramienta para orquestar múltiples contenedores como un servicio único.
2. **Redes personalizadas**: Facilitan la comunicación entre contenedores sin exponer puertos al host.
3. **Proxy inverso**: Nginx recibe las solicitudes y las reenvía a los servidores backend.
4. **Upstream**: Grupo de servidores backend definidos en Nginx que actúan como destinos para el balanceo de carga.
5. **Encabezados HTTP**: Headers como `X-Real-IP`, `X-Upstream-Server` y `Host` se reenvían para mantener información útil entre el cliente y los servidores.

**📋 Estructura del proyecto**:

```
BalanceadorCarga/
├── docker-compose.yaml       # Orquestación de servicios
├── proxy/
│   ├── Dockerfile            # Imagen del proxy (Nginx)
│   └── nginx.conf            # Configuración del balanceador de carga
├── sitio1/
│   └── Dockerfile            # Primer servidor backend
├── sitio2/
│   └── Dockerfile            # Segundo servidor backend
└── sitio3/
    └── Dockerfile            # Tercer servidor backend
```

**🔍 Configuración destacada**:

**docker-compose.yaml**:

```yaml
services:
  proxy:
    build: ./proxy
    ports:
      - "8081:80"              # Expone el proxy en puerto 8081 del host
    depends_on:
      - backend1
      - backend2
      - backend3
    networks:
      - app-network

  backend1:
    build: ./sitio1
    networks:
      - app-network

  backend2:
    build: ./sitio2
    networks:
      - app-network

  backend3:
    build: ./sitio3
    networks:
      - app-network

networks:
  app-network:
    driver: bridge             # Red personalizada para comunicación interna
```

**nginx.conf**:

El archivo de configuración define:

- **Upstream backend_servers**: Grupo de tres servidores (backend1, backend2, backend3) para balanceo de carga round-robin.
- **Proxy pass**: Reenvía solicitudes HTTP al grupo upstream.
- **Headers personalizados**:
  - `X-Real-IP`: Captura la IP real del cliente.
  - `X-Upstream-Server`: Muestra cuál servidor backend manejó la solicitud.
  - `Cache-Control`: Desactiva el cacheo para monitorear el balanceo en tiempo real.

**▶️ Comandos para ejecutar**:

```bash
cd BalanceadorCarga

# Construir e iniciar todos los servicios
docker-compose up -d --build

# Ver logs del proxy
docker-compose logs -f proxy

# Detener todos los servicios
docker-compose down

# Reconstruir imágenes sin caché
docker-compose build --no-cache
```

**🧪 Pruebas**:

Una vez que el stack está en ejecución, puedes probar el balanceador de carga:

```bash
# Realizar múltiples solicitudes para ver el balanceo
for i in {1..9}; do curl -i http://localhost:8081/; done

# Ver encabezados de respuesta (incluyendo X-Upstream-Server)
curl -v http://localhost:8081/

# Inspeccionar logs de los servicios
docker-compose logs backend1 backend2 backend3
```

**💡 Conceptos aprendidos**:

- ✅ Orquestación de contenedores con Docker Compose.
- ✅ Configuración de redes personalizadas (bridge) para aislar servicios.
- ✅ Balanceo de carga con Nginx (upstream y proxy_pass).
- ✅ Service discovery: Los contenedores se comunican entre sí usando nombres de servicios (backend1, backend2, backend3).
- ✅ Gestión de dependencias entre servicios (depends_on).
- ✅ Reenvío de encabezados HTTP para mantener información del cliente.

---

&nbsp;

## 8. 🐳 Stacks (Docker Swarm)

**📝 Descripción**: Este proyecto demuestra el uso de Docker Swarm y Docker Stacks para orquestar y desplegar aplicaciones distribuidas en modo cluster. Un Stack es un conjunto de servicios (multi-contenedor) que se definen en un archivo `docker-compose.yaml` y se despliegan en un clúster de Swarm, proporcionando escalabilidad, tolerancia a fallos y gestión centralizada.

**🌐 Componentes de la Arquitectura**:

- **Docker Swarm**: Orquestador nativo de Docker que permite agrupar múltiples daemons de Docker (managers y workers) en un clúster para desplegar y gestionar servicios.
- **Manager Nodes**: Nodos que controlan el estado del clúster y distribuyen tareas entre workers.
- **Worker Nodes**: Nodos que ejecutan los contenedores y servicios.
- **Services**: Abstracciones de Docker Compose que reemplazan a los contenedores individuales, permitiendo réplicas, actualizaciones graduales y políticas de reinicio.
- **Overlay Networks**: Redes que permiten la comunicación entre contenedores en diferentes hosts dentro del Swarm.

**📋 Estructura del proyecto**:

```
Stacks/
├── docker-compose.yaml       # Definición de servicios para el Stack
└── app/
    └── Dockerfile            # Imagen de la aplicación frontend
```

**🔍 Configuración destacada**:

**docker-compose.yaml**:

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    deploy:
      replicas: 3              # Ejecutar 3 instancias del servicio
      update_config:
        parallelism: 1         # Actualizar una instancia a la vez
        delay: 10s             # Esperar 10 segundos entre actualizaciones
      restart_policy:
        condition: on-failure  # Reiniciar solo si falla
    networks:
      - frontend

  app:
    image: frontend:latest
    deploy:
      replicas: 5              # Ejecutar 5 instancias del servicio
      restart_policy:
        condition: any         # Reiniciar siempre que se detenga
    networks:
      - frontend
      - backend

networks:
  frontend:
    driver: overlay            # Red superpuesta para comunicación entre hosts
  backend:
    driver: overlay            # Red superpuesta para comunicación entre hosts
```

**🔑 Conceptos Clave**:

1. **Replicas**: Define cuántas instancias de un servicio se ejecutarán en el clúster. Swarm distribuye estas instancias entre los worker nodes disponibles.

2. **Update Config**: Controla cómo se actualizan los servicios:
   - `parallelism`: Número de instancias a actualizar simultáneamente.
   - `delay`: Tiempo de espera entre actualizaciones de instancias.

3. **Restart Policy**: Define qué ocurre cuando un contenedor falla:
   - `on-failure`: Reinicia solo si el contenedor sale con un código de error.
   - `any`: Reinicia siempre que se detenga (recomendado para servicios críticos).
   - `none`: No reinicia automáticamente.

4. **Overlay Networks**: Redes virtuales que encapsulan el tráfico entre contenedores, permitiendo que servicios en diferentes hosts se comuniquen como si estuvieran en la misma red.

5. **Service Discovery**: Swarm proporciona un DNS interno que permite que los servicios se descubran entre sí usando sus nombres.

**▶️ Comandos para ejecutar**:

**Inicializar Docker Swarm**:

```bash
# Inicializar el clúster Swarm (convierte el host actual en manager)
docker swarm init

# Ver información del Swarm
docker swarm ls
docker info | grep Swarm
```

**Desplegar un Stack**:

```bash
cd Stacks

# Construir la imagen de la aplicación (si no existe)
docker build -t frontend:latest ./app

# Desplegar el Stack (requiere Swarm activo)
docker stack deploy -c docker-compose.yaml mi_despliegue

# Listar todos los Stacks desplegados
docker stack ls

# Ver servicios dentro del Stack
docker stack services mi_despliegue

# Ver tareas (contenedores) de un servicio específico
docker service ps mi_despliegue_web
docker service ps mi_despliegue_app
```

**Monitoreo y Gestión**:

```bash
# Ver logs de un servicio
docker service logs mi_despliegue_web

# Escalar un servicio (cambiar número de réplicas)
docker service scale mi_despliegue_web=5

# Inspeccionar detalles de un servicio
docker service inspect mi_despliegue_web

# Actualizar un servicio (cambiar imagen, portos, etc.)
docker service update --image nginx:1.29 mi_despliegue_web
```

**Remover el Stack**:

```bash
# Eliminar el Stack y todos sus servicios
docker stack rm mi_despliegue

# Dejar el Swarm (desactiva modo Swarm)
docker swarm leave --force

# Listar nodos del Swarm (antes de dejar el Swarm)
docker node ls
```

**🧪 Script de Demostración Completo**:

```bash
#!/bin/bash

# 1. Inicializar Docker Swarm
echo "Inicializando Docker Swarm..."
docker swarm init

# 2. Construir la imagen personalizada
echo "Construyendo imagen de la aplicación..."
docker build -t frontend:latest ./Stacks/app

# 3. Desplegar el Stack
echo "Desplegando Stack..."
docker stack deploy -c ./Stacks/docker-compose.yaml mi_despliegue

# 4. Verificar el despliegue
echo "Esperando a que los servicios estén listos..."
sleep 5

echo "Listando Stacks:"
docker stack ls

echo "Listando servicios del Stack:"
docker stack services mi_despliegue

echo "Listando tareas (contenedores):"
docker service ps mi_despliegue_web
docker service ps mi_despliegue_app

# 5. Prueba de conectividad
echo "Probando acceso al servicio web..."
curl -I http://localhost

# 6. Información del clúster
echo "Estado del clúster Swarm:"
docker node ls

# Limpieza (comentado para no eliminar el despliegue automáticamente)
# echo "Eliminando Stack..."
# docker stack rm mi_despliegue
# docker swarm leave --force
```

**💡 Conceptos aprendidos**:

- ✅ Inicialización de un clúster Docker Swarm.
- ✅ Definición de servicios con configuración de réplicas y políticas de reinicio.
- ✅ Despliegue de aplicaciones multi-servicio usando Docker Stacks.
- ✅ Configuración de redes overlay para comunicación entre hosts.
- ✅ Escalado dinámico de servicios.
- ✅ Estrategias de actualización gradual (rolling updates).
- ✅ Gestión del ciclo de vida de Stacks (crear, escalar, actualizar, eliminar).

**⚠️ Consideraciones Importantes**:

- **Ambiente de prueba**: Para experimentar con múltiples nodos, considera usar Docker en VMs o máquinas físicas separadas. En localhost, el Swarm funciona pero todos los contenedores se ejecutan en el mismo host.
- **Producción**: Para entornos de producción, considera usar Kubernetes en lugar de Docker Swarm, ya que ofrece mayor escalabilidad y características avanzadas.
- **Seguridad**: Asegúrate de asegurar el acceso al socket de Docker y usar TLS para comunicaciones entre nodos en producción.

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
