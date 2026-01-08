FROM ubuntu:latest

COPY script.sh /usr/local/bin/script.sh
RUN chmod +x /usr/local/bin/script.sh
RUN /usr/local/bin/script.sh

RUN echo "Inicio del script" && \
    echo "Configurando entorno..." && \
    echo "Entorno configurado correctamente." && \
    echo "Fin del script"
