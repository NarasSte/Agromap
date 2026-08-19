import { Test, TestingModule } from '@nestjs/testing';
import { CulturaController } from './cultura.controller';
import { CulturaService } from './cultura.service';
import { Cultura } from '../../entities/cultura.entity';

describe('CulturaController', () => {
  let controller: CulturaController;
  let service: jest.Mocked<CulturaService>;

  const cultura = { id: 1, nome: 'Soja' } as Cultura;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturaController],
      providers: [
        {
          provide: CulturaService,
          useValue: {
            create: jest.fn().mockResolvedValue(cultura),
            findAll: jest.fn().mockResolvedValue([cultura]),
            findOne: jest.fn().mockResolvedValue(cultura),
            update: jest.fn().mockResolvedValue(cultura),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get(CulturaController);
    service = module.get(CulturaService);
  });

  it('delegates creation to the service', async () => {
    await expect(controller.create({ nome: 'Soja' })).resolves.toEqual(cultura);
    expect(service.create).toHaveBeenCalledWith({ nome: 'Soja' });
  });

  it('lists culturas', async () => {
    await expect(controller.findAll()).resolves.toEqual([cultura]);
  });

  it('converts the id route param to a number', async () => {
    await controller.findOne('1');
    await controller.update('2', { nome: 'Milho' });
    await controller.remove('3');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.update).toHaveBeenCalledWith(2, { nome: 'Milho' });
    expect(service.remove).toHaveBeenCalledWith(3);
  });
});
