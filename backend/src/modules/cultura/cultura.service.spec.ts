import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaService } from './cultura.service';
import { Cultura } from '../../entities/cultura.entity';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: jest.Mocked<Repository<Cultura>>;

  const cultura = { id: 1, nome: 'Soja' } as Cultura;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturaService,
        {
          provide: getRepositoryToken(Cultura),
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

    service = module.get(CulturaService);
    repository = module.get(getRepositoryToken(Cultura));
  });

  it('creates and persists a cultura', async () => {
    repository.create.mockReturnValue(cultura);
    repository.save.mockResolvedValue(cultura);

    await expect(service.create({ nome: 'Soja' })).resolves.toEqual(cultura);
    expect(repository.create).toHaveBeenCalledWith({ nome: 'Soja' });
    expect(repository.save).toHaveBeenCalledWith(cultura);
  });

  it('returns all culturas', async () => {
    repository.find.mockResolvedValue([cultura]);

    await expect(service.findAll()).resolves.toEqual([cultura]);
  });

  it('returns a cultura by id', async () => {
    repository.findOne.mockResolvedValue(cultura);

    await expect(service.findOne(1)).resolves.toEqual(cultura);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('throws when the cultura does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('merges the payload into the existing cultura on update', async () => {
    const updated = { ...cultura, nome: 'Milho' } as Cultura;
    repository.findOne.mockResolvedValue(cultura);
    repository.save.mockResolvedValue(updated);

    await expect(service.update(1, { nome: 'Milho' })).resolves.toEqual(updated);
    expect(repository.merge).toHaveBeenCalledWith(cultura, { nome: 'Milho' });
  });

  it('removes an existing cultura', async () => {
    repository.findOne.mockResolvedValue(cultura);

    await service.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(cultura);
  });

  it('does not remove when the cultura does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
