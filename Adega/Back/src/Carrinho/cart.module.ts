import { Module } from '@nestjs/common';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProdutoModule } from '../produto/produto.module';

@Module({
  imports: [ProdutoModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
