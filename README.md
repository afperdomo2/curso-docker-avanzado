# Curso Docker Avanzado

## Guía para Ejecutar con Docker

### 1. MultiStage

Navega al directorio del proyecto MultiStage y ejecuta el siguiente comando para construir la imagen:

```bash
cd MultiStage

docker build -t multistage .

docker run -p 8080:80 multistage
```

Este comando crea una imagen llamada `multistage` utilizando el Dockerfile multistage, que reduce el tamaño final de la imagen al no incluir las herramientas de compilación en la imagen final.
