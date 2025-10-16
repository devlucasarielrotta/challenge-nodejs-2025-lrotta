<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ola click challenge
Este proyecto es un desafio de olaclick, el cual consiste en crear una API REST  simple usando Node.js con Nest.js, PostgreSQL con Sequelize y Redis.

# Orders API - Correr con docker 
1. Clonar el proyecto
2. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
3. Correr el comando de docker
```
docker-compose up --build

```

# Endpoints disponibles
- `POST /orders` - Crea una nueva orden
- `POST /orders/:id/advance` - Avanza el estado de una orden
- `GET /orders` - Lista todas las ordenes con estado distinto a DELIVERED
- `GET /orders/:id` - Obtiene una orden por su ID.
- `GET /seed` - Poblar la base de datos.

# Postman
- Se adjunta el archivo postman API Orders - OlaClick.postman_collection.json en la raíz del proyecto

# Testing

Para correr los tests:

```
npm run test
```

# Consideraciones técnicas
- Se creo un job para limpiar las ordenes antiguas en estado DELIVERED y que sean mayores a 90 días a la fecha
- Se utilizo Redis con 30 segundos de TTL para el cache de las órdenes. 
- Se utiliza ConfigModule para obtener las variables de entorno 

# Author
- Lucas Ariel Rotta