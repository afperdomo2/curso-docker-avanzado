
FROM nginx:1.29

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
