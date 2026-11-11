import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ProdutoService } from '../produto/produto.service';
import { CartDto } from './dto/cart.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  private cart: CartItemDto[] = [];

  constructor(private readonly produtoService: ProdutoService) {}

  // Retorna o carrinho e o valor total
  getCart(): CartDto {
    const total = this.cart.reduce((acc, item) => acc + item.subtotal, 0);

    return {
      items: this.cart,
      total,
    };
  }

  // Adiciona um produto ao carrinho
  async addItem(produtoId: number, quantidade = 1): Promise<CartDto> {
    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      throw new BadRequestException('ID do produto inválido');
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new BadRequestException('Quantidade inválida');
    }

    // Busca o produto sem modificar seu registro
    const produto = await this.produtoService.buscarPorId(produtoId);

    const existingItem = this.cart.find(
      (item) => item.produtoId === produto.id,
    );

    if (existingItem) {
      existingItem.quantidade += quantidade;

      existingItem.subtotal =
        existingItem.quantidade * existingItem.precoUnitario;
    } else {
      this.cart.push({
        produtoId: produto.id,
        nome: produto.nome,
        precoUnitario: Number(produto.preco),
        quantidade,
        subtotal: Number(produto.preco) * quantidade,
        imagem: produto.imagem || '/images/default.png',
      });
    }

    return this.getCart();
  }

  // Remove um produto do carrinho
  removeItem(produtoId: number): CartDto {
    this.cart = this.cart.filter((item) => item.produtoId !== produtoId);

    return this.getCart();
  }

  // Atualiza a quantidade de um produto
  updateQuantity(produtoId: number, quantidade: number): CartDto {
    const item = this.cart.find((item) => item.produtoId === produtoId);

    if (!item) {
      throw new NotFoundException('Produto não está no carrinho');
    }

    if (!Number.isInteger(quantidade)) {
      throw new BadRequestException('Quantidade inválida');
    }

    // Quantidade zero ou negativa remove o produto
    if (quantidade <= 0) {
      return this.removeItem(produtoId);
    }

    item.quantidade = quantidade;

    item.subtotal = item.precoUnitario * quantidade;

    return this.getCart();
  }

  // Limpa todos os produtos do carrinho
  clearCart(): CartDto {
    this.cart = [];

    return this.getCart();
  }
}
