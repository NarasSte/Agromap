import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { FazendaModule } from './modules/fazenda/fazenda.module';
import { TalhaoModule } from './modules/talhao/talhao.module';
import { CulturaModule } from './modules/cultura/cultura.module';
import { SoloModule } from './modules/solo/solo.module';
import { PlantioModule } from './modules/plantio/plantio.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { EquipamentoModule } from './modules/equipamento/equipamento.module';
import { AplicacaoModule } from './modules/aplicacao/aplicacao.module';
import { MonitoramentoModule } from './modules/monitoramento/monitoramento.module';
import { IrrigacaoModule } from './modules/irrigacao/irrigacao.module';
import { ColheitaModule } from './modules/colheita/colheita.module';
import { CustoProducaoModule } from './modules/custo-producao/custo-producao.module';
import { ClimaRegistroModule } from './modules/clima-registro/clima-registro.module';
import { PrevisaoClimaticaModule } from './modules/previsao-climatica/previsao-climatica.module';
import { AlertaModule } from './modules/alerta/alerta.module';
import { ManutencaoEquipamentoModule } from './modules/manutencao-equipamento/manutencao-equipamento.module';
import { UsoEquipamentoModule } from './modules/uso-equipamento/uso-equipamento.module';
import { TalhaoSoloModule } from './modules/talhao-solo/talhao-solo.module';
import { RecomendacaoClimaModule } from './modules/recomendacao-clima/recomendacao-clima.module';

// Entities
import { Fazenda } from './entities/fazenda.entity';
import { Talhao } from './entities/talhao.entity';
import { Cultura } from './entities/cultura.entity';
import { Solo } from './entities/solo.entity';
import { Plantio } from './entities/plantio.entity';
import { Produto } from './entities/produto.entity';
import { Equipamento } from './entities/equipamento.entity';
import { Aplicacao } from './entities/aplicacao.entity';
import { Monitoramento } from './entities/monitoramento.entity';
import { Irrigacao } from './entities/irrigacao.entity';
import { Colheita } from './entities/colheita.entity';
import { CustoProducao } from './entities/custo-producao.entity';
import { ClimaRegistro } from './entities/clima-registro.entity';
import { PrevisaoClimatica } from './entities/previsao-climatica.entity';
import { Alerta } from './entities/alerta.entity';
import { ManutencaoEquipamento } from './entities/manutencao-equipamento.entity';
import { UsoEquipamento } from './entities/uso-equipamento.entity';
import { TalhaoSolo } from './entities/talhao-solo.entity';
import { RecomendacaoClima } from './entities/recomendacao-clima.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Fazenda,
          Talhao,
          Cultura,
          Solo,
          Plantio,
          Produto,
          Equipamento,
          Aplicacao,
          Monitoramento,
          Irrigacao,
          Colheita,
          CustoProducao,
          ClimaRegistro,
          PrevisaoClimatica,
          Alerta,
          ManutencaoEquipamento,
          UsoEquipamento,
          TalhaoSolo,
          RecomendacaoClima,
        ],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    FazendaModule,
    TalhaoModule,
    CulturaModule,
    SoloModule,
    PlantioModule,
    ProdutoModule,
    EquipamentoModule,
    AplicacaoModule,
    MonitoramentoModule,
    IrrigacaoModule,
    ColheitaModule,
    CustoProducaoModule,
    ClimaRegistroModule,
    PrevisaoClimaticaModule,
    AlertaModule,
    ManutencaoEquipamentoModule,
    UsoEquipamentoModule,
    TalhaoSoloModule,
    RecomendacaoClimaModule,
  ],
})
export class AppModule {}
