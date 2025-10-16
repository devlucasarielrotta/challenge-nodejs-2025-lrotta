import { Sequelize, Transaction } from 'sequelize';
import { Cache } from 'cache-manager';
import { OrdersService } from '../../../src/orders/orders.service';
import { Order } from '../../../src/orders/entities/order.entity';
import { OrderItem } from '../../../src/orders/entities/order-item.entity';
import { OrderStatus } from '../../../src/orders/entities/enums/orderStatus.enum';
import { CreateOrderDto } from '../../../src/orders/dto/create-order.dto';

type MockType<T> = {
  [K in keyof T]?: jest.Mock<{}>;
};

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: MockType<typeof Order>;
  let orderItemModel: MockType<typeof OrderItem>;
  let sequelize: Sequelize;
  let cacheManager: Cache;

  let mockTransaction: Transaction;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction;

    orderModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      destroy: jest.fn(),
    };

    orderItemModel = {};

    sequelize = {
      transaction: jest.fn().mockResolvedValue(mockTransaction),
    } as unknown as Sequelize;

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as Cache;

    service = new OrdersService(
      orderModel as unknown as typeof Order,
      sequelize,
      cacheManager,
    );
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const dto: CreateOrderDto = {
        clientName: 'Lucas',
        items: [{ description: 'Pizza', quantity: 1, unitPrice: 10 }],
      };

      const mockOrder: Partial<Order> = { id: 'uuid-1', clientName: 'Lucas', status: OrderStatus.INITIATED };
      (orderModel.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.create(dto);

      expect(orderModel.create).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findOne', () => {
    it('should return an order if found', async () => {
      const mockOrder = { id: '1', status: OrderStatus.INITIATED };
      (orderModel.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.findOne('1');

      expect(result).toEqual(mockOrder);
      expect(orderModel.findByPk).toHaveBeenCalledWith('1', { include: [OrderItem] });
    });


  });

  describe('advanceStatus', () => {
    it('should advance status to SENT', async () => {
      const mockOrder = { id: '1', status: OrderStatus.INITIATED, save: jest.fn() };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrder as unknown as Order);

      const result = await service.advanceStatus('1');

      expect(mockOrder.save).toHaveBeenCalled();
      expect(result).toContain(`Orden 1 actualizada a estado ${OrderStatus.SENT}`);
      expect(cacheManager.del).toHaveBeenCalledWith('orders:active');
    });

  });
});
