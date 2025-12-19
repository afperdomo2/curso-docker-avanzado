FROM nginx:1.21.6

# Variable para invalidar la cache
ARG CACHEBUST=1
RUN apt-get update && apt-get -y upgrade

RUN echo '<html><body><h1>Hola, Mundo desde NGINX en Docker!</h1></body></html>' > /usr/share/nginx/html/index.html