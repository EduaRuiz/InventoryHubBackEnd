import { Repository } from 'typeorm';
import { Observable, of, throwError } from 'rxjs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserPostgresEntity, UserPostgresRepository } from '..';

describe('UserPostgresRepository', () => {
  let userRepository: UserPostgresRepository;
  let mockUserEntity: UserPostgresEntity;
  let mockRepository: Partial<Repository<UserPostgresEntity>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      findOneBy: jest.fn(),
    };

    userRepository = new UserPostgresRepository(
      mockRepository as Repository<UserPostgresEntity>,
    );

    mockUserEntity = {
      id: '1',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      role: 'admin',
      branchId: '1',
    } as UserPostgresEntity;
  });

  describe('create', () => {
    it('should create a new user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockUserEntity);
      const result: Observable<UserPostgresEntity> =
        userRepository.create(mockUserEntity);
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.save).toHaveBeenCalledWith(mockUserEntity);
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle save conflict', (done) => {
      // Arrange
      const error = {
        code: '23505',
        detail: 'Key (email)=() already exists.',
      };
      jest.spyOn(mockRepository, 'save').mockRejectedValue(error);
      const result: Observable<UserPostgresEntity> =
        userRepository.create(mockUserEntity);
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(ConflictException);
          expect(mockRepository.save).toHaveBeenCalledWith(mockUserEntity);
          done();
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'save').mockResolvedValue(mockUserEntity);
      jest
        .spyOn(userRepository, 'findOneById')
        .mockReturnValue(of(null) as any);

      // Act
      const result: Observable<UserPostgresEntity> = userRepository.update(
        '1',
        mockUserEntity,
      );

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.save).toHaveBeenCalledWith(mockUserEntity);
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle update conflict', (done) => {
      // Arrange
      const error = {
        code: '23505',
        detail: 'Key (email)=() already exists.',
      };
      jest.spyOn(mockRepository, 'save').mockRejectedValue(error);
      jest
        .spyOn(userRepository, 'findOneById')
        .mockReturnValue(of(null) as any);

      // Act
      const result: Observable<UserPostgresEntity> = userRepository.update(
        '1',
        mockUserEntity,
      );

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(ConflictException);
          expect(mockRepository.save).toHaveBeenCalledWith(mockUserEntity);
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'remove').mockResolvedValue(mockUserEntity);
      jest
        .spyOn(userRepository, 'findOneById')
        .mockReturnValue(of(mockUserEntity) as any);

      // Act
      const result: Observable<UserPostgresEntity> = userRepository.delete('1');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.remove).toHaveBeenCalledWith(mockUserEntity);
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle delete not found', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'remove').mockResolvedValue(mockUserEntity);
      jest
        .spyOn(userRepository, 'findOneById')
        .mockReturnValue(throwError(() => new NotFoundException()) as any);

      // Act
      const result: Observable<UserPostgresEntity> = userRepository.delete('1');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'find').mockResolvedValue([mockUserEntity]);
      const result: Observable<UserPostgresEntity[]> = userRepository.findAll();

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual([mockUserEntity]);
          expect(mockRepository.find).toHaveBeenCalled();
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle find all not found', (done) => {
      // Arrange
      jest
        .spyOn(mockRepository, 'find')
        .mockRejectedValue(new NotFoundException());
      const result: Observable<UserPostgresEntity[]> = userRepository.findAll();

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(mockRepository.find).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return an existing user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(mockUserEntity);
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneById('1');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle find one by id not found', (done) => {
      // Arrange
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockRejectedValue(new NotFoundException());
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneById('1');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
          done();
        },
      });
    });

    it('should handle find one by id null', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(of(null) as any);
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneById('1');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
          done();
        },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return an existing user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(mockUserEntity);
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneByEmail('mockUserEntity.email');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
          });
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle find one by email not found', (done) => {
      // Arrange
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockRejectedValue(new NotFoundException());
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneByEmail('mockUserEntity.email');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
          });
          done();
        },
      });
    });

    it('should handle find one by email null', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(of(null) as any);
      const result: Observable<UserPostgresEntity> =
        userRepository.findOneByEmail('mockUserEntity.email');

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
          });
          done();
        },
      });
    });
  });

  describe('login', () => {
    it('should return an existing user', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(mockUserEntity);
      const result: Observable<UserPostgresEntity> = userRepository.login(
        'mockUserEntity.email',
        'mockUserEntity.password',
      );

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: (value) => {
          expect(value).toEqual(mockUserEntity);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
            password: 'mockUserEntity.password',
          });
          done();
        },
        error: (error) => done(error),
      });
    });

    it('should handle login not found', (done) => {
      // Arrange
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockRejectedValue(new NotFoundException());
      const result: Observable<UserPostgresEntity> = userRepository.login(
        'mockUserEntity.email',
        'mockUserEntity.password',
      );

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
            password: 'mockUserEntity.password',
          });
          done();
        },
      });
    });

    it('should handle login null', (done) => {
      // Arrange
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(of(null) as any);
      const result: Observable<UserPostgresEntity> = userRepository.login(
        'mockUserEntity.email',
        'mockUserEntity.password',
      );

      // Assert
      expect(result).toBeDefined();
      result.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(mockRepository.findOneBy).toHaveBeenCalledWith({
            email: 'mockUserEntity.email',
            password: 'mockUserEntity.password',
          });
          done();
        },
      });
    });
  });
});
