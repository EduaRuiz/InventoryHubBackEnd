import {
  EventDomainModel,
  ProductDomainModel,
  SaleDomainModel,
} from '@domain/models';
import { SocketGateway } from './socket.gateway';
import { Socket, Server } from 'socket.io';
import { SaleTypeEnum } from '@domain/enums';

describe('SocketGateway', () => {
  const socketGateway = new SocketGateway();
  const client: Socket = {
    join: jest.fn(),
    emit: jest.fn(),
    leave: jest.fn(),
    server: null,
  } as unknown as Socket;

  beforeEach(() => {});

  describe('afterInit', () => {
    it('should log a message', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const serverMock: any = null;

      // Act
      socketGateway.afterInit(serverMock);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Server initialized');
      consoleSpy.mockRestore();
    });
  });

  describe('handleConnection', () => {
    it('should log a message', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const clientMock: any = null;
      const argsMock: any[] = [];

      // Act
      socketGateway.handleConnection(clientMock, argsMock);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Client connected');
      consoleSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should log a message', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const clientMock: any = null;

      // Act
      socketGateway.handleDisconnect(clientMock);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Client disconnected');
      consoleSpy.mockRestore();
    });
  });
  describe('handleJoinInventory', () => {
    it('should join the specified room and emit a "joined" event', () => {
      // Arrange
      const branchId = '123';

      // Act
      socketGateway.handleJoinInventory(client, branchId);

      // Assert
      expect(client.join).toHaveBeenCalledWith(`branch.${branchId}`);
      expect(client.emit).toHaveBeenCalledWith('joined', `branch.${branchId}`);
    });
  });

  describe('handleJoinSale', () => {
    it('should join the specified room and emit a "joined" event', () => {
      // Arrange
      const branchId = '456';

      // Act
      socketGateway.handleJoinSale(client, branchId);

      // Assert
      expect(client.join).toHaveBeenCalledWith(`branch.${branchId}`);
      expect(client.emit).toHaveBeenCalledWith('joined', `branch.${branchId}`);
    });
  });

  describe('handleLeave', () => {
    it('should leave the specified room and emit a "left" event', () => {
      // Arrange
      const branchId = '789';

      // Act
      socketGateway.handleLeave(client, branchId);

      // Assert
      expect(client.leave).toHaveBeenCalledWith(`branch.${branchId}`);
      expect(client.emit).toHaveBeenCalledWith('left', `branch.${branchId}`);
    });
  });

  describe('handleJoinI', () => {
    it('should join the specified room and emit a "joined" event', () => {
      // Arrange
      const branchId = '123';

      // Act
      socketGateway.handleJoinI(client, branchId);

      // Assert
      expect(client.join).toHaveBeenCalledWith(`branch.${branchId}`);
      expect(client.emit).toHaveBeenCalledWith('joined', `branch.${branchId}`);
    });
  });

  describe('handleLeaveI', () => {
    it('should leave the specified room and emit a "left" event', () => {
      // Arrange
      const branchId = '456';

      // Act
      socketGateway.handleLeaveI(client, branchId);

      // Assert
      expect(client.leave).toHaveBeenCalledWith(`branch.${branchId}`);
      expect(client.emit).toHaveBeenCalledWith('left', `branch.${branchId}`);
    });
  });

  describe('handleIncomingInventory', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleIncomingInventory(client, product);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('handleRoomLeave', () => {
    it('should leave the specified room', () => {
      // Arrange
      const id = '123';

      // Act
      socketGateway.handleRoomLeave(client, id);

      // Assert
      expect(client.leave).toHaveBeenCalledWith(`branch.${id}`);
    });
  });

  describe('handleProductAdded', () => {
    it('should emit a "ProductCreate" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleProductAdded(client, product);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('handleProductChanged', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleProductChanged(client, product);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('handleProductPurchased', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleProductPurchased(client, product);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('handleCustomerSaleRegistered', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const sale = {
        branchId: '123',
        customerId: '456',
        number: 523,
        date: new Date(),
        type: SaleTypeEnum.CUSTOMER_SALE,
        products: [
          {
            branchId: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 100,
            quantity: 10,
            category: 'Category 1',
          },
        ],
      } as unknown as SaleDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleCustomerSaleRegistered(client, sale);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('handleSellerSaleRegistered', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const sale = {
        branchId: '123',
        sellerId: '456',
        number: 523,
        date: new Date(),
        type: SaleTypeEnum.SELLER_SALE,
        products: [
          {
            branchId: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 100,
            quantity: 10,
            category: 'Category 1',
          },
        ],
      } as unknown as SaleDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;

      // Act
      socketGateway.handleSellerSaleRegistered(client, sale);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('productRegistered', () => {
    it('should emit a "ProductCreate" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;
      const msg = {
        eventBody: product,
      } as unknown as EventDomainModel;

      // Act
      socketGateway.productRegistered(msg);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('productUpdated', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;
      const msg = {
        eventBody: product,
      } as unknown as EventDomainModel;

      // Act
      socketGateway.productUpdated(msg);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('productPurchase', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const product = {
        branchId: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 10,
        category: 'Category 1',
      } as unknown as ProductDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;
      const msg = {
        eventBody: product,
      } as unknown as EventDomainModel;

      // Act
      socketGateway.productPurchase(msg);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('sellerSaleRegistered', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const sale = {
        branchId: '123',
        sellerId: '456',
        number: 523,
        date: new Date(),
        type: SaleTypeEnum.SELLER_SALE,
        products: [
          {
            branchId: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 100,
            quantity: 10,
            category: 'Category 1',
          },
        ],
      } as unknown as SaleDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;
      const msg = {
        eventBody: sale,
      } as unknown as EventDomainModel;

      // Act
      socketGateway.sellerSaleRegistered(msg);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });

  describe('customerSaleRegistered', () => {
    it('should emit a "ProductChange" event to the specified room', () => {
      // Arrange
      const sale = {
        branchId: '123',
        customerId: '456',
        number: 523,
        date: new Date(),
        type: SaleTypeEnum.CUSTOMER_SALE,
        products: [
          {
            branchId: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 100,
            quantity: 10,
            category: 'Category 1',
          },
        ],
      } as unknown as SaleDomainModel;
      const serverMock: Server = {
        to: jest.fn(() => ({ emit: jest.fn() })),
      } as unknown as Server;
      const socketGateway: SocketGateway = new SocketGateway();
      socketGateway.server = serverMock;
      const msg = {
        eventBody: sale,
      } as unknown as EventDomainModel;

      // Act
      socketGateway.customerSaleRegistered(msg);

      // Assert
      expect(serverMock.to).toHaveBeenCalledWith('branch.123');
    });
  });
});
