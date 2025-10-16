import { CreateOrderDto } from "src/orders/dto/create-order.dto";


export const ordersSeed: CreateOrderDto[] = Array.from({ length: 10 }, (_, i) => ({
  clientName: `Cliente ${i + 1}`,
  items: [
    {
      description: `Item principal ${i + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: Math.floor(Math.random() * 100) + 10,
    },
    // opcional: agregar un segundo item aleatorio
    {
      description: `Item extra ${i + 1}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: Math.floor(Math.random() * 50) + 5,
    },
  ],
}));
