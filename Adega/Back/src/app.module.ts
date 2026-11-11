import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseSeedService } from './database-seed.service';

import { Produto } from './produto/produto.entity';
import { Secao } from './secao/secao.entity';

import { ProdutoModule } from './produto/produto.module';
import { SecaoModule } from './secao/secao.module';
import { UsersModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { CartModule } from './Carrinho/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    TypeOrmModule.forFeature([Secao, Produto]),

    ProdutoModule,
    SecaoModule,
    UsersModule,
    PedidoModule,
    CartModule,
  ],

  providers: [DatabaseSeedService],
})
export class AppModule {}
