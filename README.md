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
- `GET /seed` - Poblar la base de datos.
- `POST /orders` - Crea una nueva orden
- `POST /orders/:id/advance` - Avanza el estado de una orden
- `GET /orders` - Lista todas las ordenes con estado distinto a DELIVERED
- `GET /orders/:id` - Obtiene una orden por su ID.

# Testing

Para correr los tests:

```
npm run test
```