import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FazendaService } from './fazenda.service';
import { Fazenda } from '../../entities/fazenda.entity';

describe('FazendaService', () => {
  let service: FazendaService;
  let repository: jest.Mocked<Repository<Fazenda>>;

  const fazenda = { id: 1, nome: 'Fazenda Boa Vista' } as Fazenda;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FazendaService,
        {
          provide: getRepositoryToken(Fazenda),
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

    service = module.get(FazendaService);
    repository = module.get(getRepositoryToken(Fazenda));
  });

  it('creates and persists a fazenda', async () => {
    repository.create.mockReturnValue(fazenda);
    repository.save.mockResolvedValue(fazenda);

    await expect(service.create({ nome: 'Fazenda Boa Vista' })).resolves.toEqual(fazenda);
    expect(repository.save).toHaveBeenCalledWith(fazenda);
  });

  it('returns all fazendas', async () => {
    repository.find.mockResolvedValue([fazenda]);

    await expect(service.findAll()).resolves.toEqual([fazenda]);
  });

  it('throws when the fazenda does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.update(99, { nome: 'x' })).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('merges the payload into the existing fazenda on update', async () => {
    const updated = { ...fazenda, cidade: 'Uberaba' } as Fazenda;
    repository.findOne.mockResolvedValue(fazenda);
    repository.save.mockResolvedValue(updated);

    await expect(service.update(1, { cidade: 'Uberaba' })).resolves.toEqual(updated);
    expect(repository.merge).toHaveBeenCalledWith(fazenda, { cidade: 'Uberaba' });
  });
});
