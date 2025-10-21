"use client";

import { useEffect } from "react";
import { useProductsStore } from "../stores/products";
import {
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
} from "../types/product";

export function useProducts(initialFilters?: ProductFilters) {
  const {
    products,
    meta,
    loading,
    error,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductThumbnail,
    deleteProduct,
    setFilters,
    clearError,
  } = useProductsStore();

  // Carrega produtos na inicialização
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
    fetchProducts(initialFilters || filters);
  }, []);

  // Função para recarregar com filtros atuais
  const refresh = () => {
    fetchProducts(filters);
  };

  // Função para buscar com novos filtros
  const search = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Função para mudar página
  const changePage = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Função para criar produto com feedback
  const create = async (input: CreateProductInput) => {
    try {
      const product = await createProduct(input);
      return { success: true, product };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao criar produto",
      };
    }
  };

  // Função para atualizar produto com feedback
  const update = async (id: string, input: UpdateProductInput) => {
    try {
      const product = await updateProduct(id, input);
      return { success: true, product };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao atualizar produto",
      };
    }
  };

  // Função para atualizar thumbnail com feedback
  const updateThumbnail = async (id: string, thumbnail: File | string) => {
    try {
      const product = await updateProductThumbnail(id, thumbnail);
      return { success: true, product };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao atualizar imagem",
      };
    }
  };

  // Função para deletar produto com feedback
  const remove = async (id: string) => {
    try {
      await deleteProduct(id);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao deletar produto",
      };
    }
  };

  return {
    // Estado
    products,
    meta,
    loading,
    error,
    filters,

    // Ações
    refresh,
    search,
    changePage,
    create,
    update,
    updateThumbnail,
    remove,
    clearError,

    // Helpers
    hasProducts: products.length > 0,
    totalPages: meta?.totalPages || 0,
    currentPage: filters.page || 1,
    isFirstPage: (filters.page || 1) === 1,
    isLastPage: (filters.page || 1) === (meta?.totalPages || 1),
  };
}
