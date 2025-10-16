 # Preguntas adicionales

## ¿Cómo desacoplarías la lógica de negocio del framework NestJS?
- Para desacoplar la lógica de negocio de cualquier framework mi idea sería programar orientado a interfaces para luego inyectarlas como dependencias, en dichas interfaces se indicaria la firma de los metodos que debe tener por ejemplo los services o los datasources, y que luego la implementación de los mismos corra por cuenta de los programadores. 

## ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?
- Hay varias opciones, pero la primera que se me ocurre por ejemplo para el obtener las órdenes sería la paginación. Otra opción sería del lado del código tratar de utilizar las mejores prácticas posibles para que la aplicación del lado del código sea lo mas eficiente posible. También se podria usar un LOAD BALANCER para repartir el tráfico. Utilizar un pool de conexiones para la base de datos, y tambien normalizar la base de datos.

## ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?
- En realidad en este caso al ser una API challenge no se le saca mucho jugo a REDIS, pero de todas formas al utilizar REDIS evitamos las reconsultas a la base de datos, mejorando la experiencia del usuario ya que si quiere consultar la data la obtiene inmediatamente al estar en memoria. 
Por otro lado, otras opciones a REDIS y dependiendo que tanto escale la API puede ser utilizar el cache de node o memcached