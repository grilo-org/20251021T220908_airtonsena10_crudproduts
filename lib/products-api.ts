import { api, endpoints } from "./api";
import { 
  Product, 
  ProductsResponse, 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilters 
} from "../types/product";

export const productsApi = {
  // Listar produtos com paginação e filtros
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.filter) params.append('filter', filters.filter);
    
    const response = await api.get(`${endpoints.products}?${params.toString()}`);
    return response.data;
  },

  // Buscar produto por ID
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(endpoints.productById(id));
    return response.data;
  },

  // Criar produto
  async createProduct(input: CreateProductInput): Promise<Product> {
    const formData = new FormData();
    formData.append('title', input.title);
    formData.append('description', input.description);
    
    if (input.thumbnail instanceof File) {
      // Se é um arquivo, adiciona diretamente
      formData.append('thumbnail', input.thumbnail);
    } else if (typeof input.thumbnail === 'string') {
      // Se é URL, baixa e converte para File
      const response = await fetch(input.thumbnail);
      const blob = await response.blob();
      const filename = input.thumbnail.split('/').pop() || 'thumbnail.jpg';
      const file = new File([blob], filename, { type: blob.type });
      formData.append('thumbnail', file);
    }

    const response = await api.post(endpoints.products, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Atualizar produto (título, descrição, status)
  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const response = await api.put(endpoints.productById(id), input);
    return response.data;
  },

  // Atualizar thumbnail do produto
  async updateProductThumbnail(id: string, thumbnail: File | string): Promise<Product> {
    const formData = new FormData();
    
    if (thumbnail instanceof File) {
      formData.append('thumbnail', thumbnail);
    } else {
      // Se é URL, baixa e converte para File
      const response = await fetch(thumbnail);
      const blob = await response.blob();
      const filename = thumbnail.split('/').pop() || 'thumbnail.jpg';
      const file = new File([blob], filename, { type: blob.type });
      formData.append('thumbnail', file);
    }

    const response = await api.patch(endpoints.productThumbnail(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    await api.delete(endpoints.productById(id));
  },
};
