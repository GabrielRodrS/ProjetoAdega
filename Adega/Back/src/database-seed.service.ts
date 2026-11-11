import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Secao } from './secao/secao.entity';
import { Produto } from './produto/produto.entity';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectRepository(Secao)
    private readonly secaoRepository: Repository<Secao>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async onModuleInit() {
    await this.criarSecoes();
    await this.criarProdutos();
  }

  private async criarSecoes() {
    const categorias = [
      'Vinhos',
      'Cervejas',
      'Whisky',
      'Vodkas',
      'Energéticos',
    ];

    for (const nome of categorias) {
      const existente = await this.secaoRepository.findOne({
        where: { nome },
      });

      if (!existente) {
        await this.secaoRepository.save(this.secaoRepository.create({ nome }));

        this.logger.log(`Categoria criada: ${nome}`);
      }
    }
  }

  private async criarProdutos() {
    const produtos = [
      {
        nome: 'Cerveja',
        tipo: 'Cervejas',
        imagem: '/Cerveja.jpg',
        preco: 5.49,
      },
      {
        nome: 'energeticos',
        tipo: 'Energéticos',
        imagem: '/energeticos.jpg',
        preco: 8.79,
      },
      {
        nome: 'energeticos2',
        tipo: 'Energéticos',
        imagem: '/energeticos2.jpg',
        preco: 9.49,
      },
      {
        nome: 'Vinho',
        tipo: 'Vinhos',
        imagem: '/Vinho.jpg',
        preco: 39.9,
      },
      {
        nome: 'vinho2',
        tipo: 'Vinhos',
        imagem: '/vinho2.jpg',
        preco: 54.9,
      },
      {
        nome: 'vinho3',
        tipo: 'Vinhos',
        imagem: '/vinho3.jpg',
        preco: 29.9,
      },
      {
        nome: 'vodka',
        tipo: 'Vodkas',
        imagem: '/vodka.jpg',
        preco: 42.9,
      },
      {
        nome: 'vodka1',
        tipo: 'Vodkas',
        imagem: '/vodka1.jpg',
        preco: 59.9,
      },
      {
        nome: 'whisky1',
        tipo: 'Whisky',
        imagem: '/whisky1.jpg',
        preco: 89.9,
      },
      {
        nome: 'whisky2',
        tipo: 'Whisky',
        imagem: '/whisky2.jpg',
        preco: 119.9,
      },
      {
        nome: 'whisky3',
        tipo: 'Whisky',
        imagem: '/whisky3.jpg',
        preco: 149.9,
      },
    ];

    for (const dados of produtos) {
      const secao = await this.secaoRepository.findOne({
        where: { nome: dados.tipo },
      });

      if (!secao) {
        throw new Error(`Seção não encontrada: ${dados.tipo}`);
      }

      const existente = await this.produtoRepository.findOne({
        where: {
          nome: dados.nome,
          tipo: dados.tipo,
        },
      });

      if (existente) {
        existente.preco = dados.preco;
        existente.imagem = dados.imagem;

        await this.produtoRepository.save(existente);

        this.logger.log(`Produto atualizado: ${dados.nome}`);
      } else {
        const novoProduto = this.produtoRepository.create({
          ...dados,
          quantidade: 0,
          secao,
        });

        await this.produtoRepository.save(novoProduto);

        this.logger.log(`Produto criado: ${dados.nome}`);
      }
    }

    this.logger.log('Cadastro e atualização dos produtos concluídos!');
  }
}
