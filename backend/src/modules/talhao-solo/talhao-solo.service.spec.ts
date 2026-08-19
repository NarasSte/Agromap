import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TalhaoSoloService } from './talhao-solo.service';
import { TalhaoSolo } from '../../entities/talhao-solo.entity';

describe('TalhaoSoloService', () => {
  let service: TalhaoSoloService;
  let repository: jest.Mocked<Repository<TalhaoSolo>>;

  const talhaoSolo = { talhao_id: 1, solo_id: 2 } as TalhaoSolo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TalhaoSoloService,
        {
          provide: getRepositoryToken(TalhaoSolo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            merge: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TalhaoSoloService);
    repository = module.get(getRepositoryToken(TalhaoSolo));
  });

  it('loads relations when listing', async () => {
    repository.find.mockResolvedValue([talhaoSolo]);

    await expect(service.findAll()).resolves.toEqual([talhaoSolo]);
    expect(repository.find).toHaveBeenCalledWith({ relations: ['talhao', 'solo'] });
  });

  it('looks up by the composite primary key', async () => {
    repository.findOne.mockResolvedValue(talhaoSolo);

    await expect(service.findOne(1, 2)).resolves.toEqual(talhaoSolo);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { talhao_id: 1, solo_id: 2 },
      relations: ['talhao', 'solo'],
    });
  });

  it('throws when the association does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1, 2)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes an existing association', async () => {
    repository.findOne.mockResolvedValue(talhaoSolo);

    await service.remove(1, 2);

    expect(repository.remove).toHaveBeenCalledWith(talhaoSolo);
  });
});
