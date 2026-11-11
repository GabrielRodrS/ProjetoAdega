"use client";

import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import Image from "next/image";
import Produto from "@/Components/Produto";

interface ProdutoType {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
  secao?: {
    nome: string;
  };
}

const images = [
  "/LogoCarrossel1.jpeg",
  "/LogoCarrossel4.jpeg",
  "/LogoCarrossel3.jpeg",
  "/LogoCarrossel2.jpeg",
];

const API_URL = "http://localhost:3000";

export default function InterfacePrincipal() {
  const [currentImage, setCurrentImage] = useState(0);

  const [topBebidas, setTopBebidas] = useState<ProdutoType[]>([]);
  const [bebidasPorSecao, setBebidasPorSecao] = useState<ProdutoType[]>([]);

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingSecao, setLoadingSecao] = useState(true);

  // Normaliza os caminhos das imagens
  const normalizarImagem = (imagem?: string) => {
    if (!imagem) return "/images/default.png";

    return imagem.startsWith("/") ? imagem : `/${imagem}`;
  };

  // Buscar maiores demandas
  useEffect(() => {
    const fetchTopBebidas = async () => {
      try {
        const res = await fetch(`${API_URL}/products/top5`);

        if (!res.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        const data: ProdutoType[] = await res.json();

        setTopBebidas(
          data.map((produto) => ({
            ...produto,
            imagem: normalizarImagem(produto.imagem),
          })),
        );
      } catch (err) {
        console.error("Erro ao carregar maiores demandas:", err);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopBebidas();
  }, []);

  // Buscar uma bebida de cada seção
  useEffect(() => {
    const fetchBebidasSecao = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);

        if (!res.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        const data: ProdutoType[] = await res.json();

        const secaoMap: Record<string, ProdutoType> = {};

        for (const produto of data) {
          const secaoNome = produto.secao?.nome;

          if (secaoNome && !secaoMap[secaoNome]) {
            secaoMap[secaoNome] = {
              ...produto,
              imagem: normalizarImagem(produto.imagem),
            };
          }
        }

        setBebidasPorSecao(Object.values(secaoMap));
      } catch (err) {
        console.error("Erro ao carregar bebidas por seção:", err);
      } finally {
        setLoadingSecao(false);
      }
    };

    fetchBebidasSecao();
  }, []);

  // Carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Componente para exibição dos produtos
  const renderProdutos = (
    produtos: ProdutoType[],
    loading: boolean,
    mensagem: string,
  ) => {
    if (loading) {
      return (
        <p className="col-span-full py-12 text-center text-sm text-slate-400">
          Carregando produtos...
        </p>
      );
    }

    if (produtos.length === 0) {
      return (
        <p className="col-span-full py-12 text-center text-sm text-slate-400">
          {mensagem}
        </p>
      );
    }

    return produtos.map((produto) => (
      <div
        key={produto.id}
        className="min-w-0 w-full max-w-full overflow-hidden"
      >
        <Produto
          id={produto.id}
          nome={produto.nome}
          preco={produto.preco}
          imagem={produto.imagem}
          quantidade={produto.quantidade}
        />
      </div>
    ));
  };

  return (
    <Header>
      <div className="w-full min-w-0 overflow-x-hidden bg-slate-100">
        {/* BANNER PRINCIPAL */}
        <section className="relative w-full overflow-hidden bg-gray-50 mt-10">
          {/* Decoração do fundo */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1500px]">
            <div className="relative h-[clamp(190px,32vw,460px)] w-full">
              <Image
                src={images[currentImage]}
                alt="Banner StockFlow"
                fill
                priority
                sizes="100vw"
                className="object-contain transition-opacity duration-700"
              />

              {/* Botão anterior */}
              <button
                onClick={prevImage}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#123B46] shadow-lg transition-all hover:scale-110 hover:bg-white sm:left-6 sm:h-12 sm:w-12"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Botão próximo */}
              <button
                onClick={nextImage}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#123B46] shadow-lg transition-all hover:scale-110 hover:bg-white sm:right-6 sm:h-12 sm:w-12"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Ir para imagem ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImage === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
          {/* MAIORES DEMANDAS */}
          <section className="mb-8 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
                  Produtos em destaque
                </span>

                <h2 className="mt-1 text-2xl font-extrabold text-[#123B46] sm:text-3xl">
                  Maiores demandas
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Confira as bebidas mais procuradas.
                </p>
              </div>

              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 sm:flex">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 3v18h18M7 14l4-4 4 4 6-7"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-6 h-px w-full bg-slate-100" />

            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {renderProdutos(
                topBebidas,
                loadingTop,
                "Nenhum produto disponível no momento.",
              )}
            </div>
          </section>

          {/* BEBIDAS POR CATEGORIA */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
                  Explore nosso catálogo
                </span>

                <h2 className="mt-1 text-2xl font-extrabold text-[#123B46] sm:text-3xl">
                  Bebidas por categoria
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Confira alguns dos produtos de cada seção.
                </p>
              </div>

              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 sm:flex">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v7H4zM13 14h7v7h-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-6 h-px w-full bg-slate-100" />

            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {renderProdutos(
                bebidasPorSecao,
                loadingSecao,
                "Nenhuma categoria disponível no momento.",
              )}
            </div>
          </section>

          {/* RODAPÉ */}
          <footer className="py-8 text-center">
            <p className="text-xs text-slate-400">
              StockFlow · Gestão e comercialização de bebidas
            </p>
          </footer>
        </div>
      </div>
    </Header>
  );
}
