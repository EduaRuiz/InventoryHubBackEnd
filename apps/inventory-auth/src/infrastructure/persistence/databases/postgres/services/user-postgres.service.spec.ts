import { UserPostgresRepository } from '../repositories';
import { UserPostgresEntity } from '../entities';
import { UserPostgresService } from './user-postgres.service';
import { of } from 'rxjs';

describe('UserPostgresService', () => {
  let userPostgresService: UserPostgresService;
  let userPostgresRepository: UserPostgresRepository;

  beforeEach(() => {
    userPostgresRepository = {
      login: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
    } as unknown as UserPostgresRepository;

    userPostgresService = new UserPostgresService(userPostgresRepository);
  });

  describe('login', () => {
    it('should return an Observable<UserPostgresEntity> when valid email and password are provided', () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const userEntity: UserPostgresEntity = {
        id: '1',
        email,
        password,
      } as unknown as UserPostgresEntity;

      jest
        .spyOn(userPostgresRepository, 'login')
        .mockReturnValue(of(userEntity) as any);

      // Act
      const result = userPostgresService.login(email, password);

      // Assert
      result.subscribe((user) => {
        expect(user).toEqual(userEntity);
        expect(userPostgresRepository.login).toHaveBeenCalledWith(
          email,
          password,
        );
      });
    });
  });

  describe('findById', () => {
    it('should return an Observable<UserPostgresEntity> when a valid id is provided', () => {
      // Arrange
      const userId = '1';
      const userEntity: UserPostgresEntity = {
        id: userId,
        email: 'test@example.com',
        password: 'password123',
      } as unknown as UserPostgresEntity;

      jest
        .spyOn(userPostgresRepository, 'findOneById')
        .mockReturnValue(of(userEntity) as any);

      // Act
      const result = userPostgresService.findById(userId);

      // Assert
      result.subscribe((user) => {
        expect(user).toEqual(userEntity);
        expect(userPostgresRepository.findOneById).toHaveBeenCalledWith(userId);
      });
    });
  });

  describe('registerUser', () => {
    it('should return an Observable<UserPostgresEntity> when a valid user object is provided', () => {
      // Arrange
      const newUser: UserPostgresEntity = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
      } as unknown as UserPostgresEntity;

      jest
        .spyOn(userPostgresRepository, 'create')
        .mockReturnValue(of(newUser) as any);

      // Act
      const result = userPostgresService.registerUser(newUser);

      // Assert
      result.subscribe((user) => {
        expect(user).toEqual(newUser);
        expect(userPostgresRepository.create).toHaveBeenCalledWith(newUser);
      });
    });
  });
});
