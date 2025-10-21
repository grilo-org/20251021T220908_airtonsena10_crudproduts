import { create } from 'zustand';
import { 
  Product, 
  ProductsResponse, 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilters 
} from '../types/product';
import { productsApi } from '../lib/products-api';

interface ProductsState {
  // Estado
  products: Product[];
  currentProduct: Product | null;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;

  // Ações
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (id: string, input: UpdateProductInput) => Promise<Product>;
  updateProductThumbnail: (id: string, thumbnail: File | string) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Estado inicial
  products: [],
  currentProduct: null,
  meta: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 10,
    filter: '',
  },

  // Buscar produtos
  fetchProducts: async (filters?: ProductFilters) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const response: ProductsResponse = await productsApi.getProducts(currentFilters);
      set({ 
        products: response.data, 
        meta: response.meta,
        filters: currentFilters,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao carregar produtos',
        loading: false 
      });
    }
  },

  // Buscar produto específico
  fetchProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const product = await productsApi.getProduct(id);
      set({ currentProduct: product, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao carregar produto',
        loading: false 
      });
    }
  },

  // Criar produto
  createProduct: async (input: CreateProductInput) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productsApi.createProduct(input);
      
      // Atualiza a lista local
      set(state => ({
        products: [newProduct, ...state.products],
        loading: false
      }));
      
      // Recarrega a lista para manter consistência com o servidor
      get().fetchProducts(get().filters);
      
      return newProduct;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao criar produto',
        loading: false 
      });
      throw error;
    }
  },

  // Atualizar produto
  updateProduct: async (id: string, input: UpdateProductInput) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productsApi.updateProduct(id, input);
      
      // Atualiza a lista local
      set(state => ({
        products: state.products.map(p => 
          p.id === id ? updatedProduct : p
        ),
        currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
        loading: false
      }));
      
      return updatedProduct;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao atualizar produto',
        loading: false 
      });
      throw error;
    }
  },

  // Atualizar thumbnail
  updateProductThumbnail: async (id: string, thumbnail: File | string) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productsApi.updateProductThumbnail(id, thumbnail);
      
      // Atualiza a lista local
      set(state => ({
        products: state.products.map(p => 
          p.id === id ? updatedProduct : p
        ),
        currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
        loading: false
      }));
      
      return updatedProduct;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao atualizar thumbnail',
        loading: false 
      });
      throw error;
    }
  },

  // Deletar produto
  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await productsApi.deleteProduct(id);
      
      // Remove da lista local
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        loading: false
      }));
      
      // Recarrega a lista para manter consistência
      get().fetchProducts(get().filters);
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Erro ao deletar produto',
        loading: false 
      });
      throw error;
    }
  },

  // Definir filtros
  setFilters: (filters: Partial<ProductFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  // Limpar erro
  clearError: () => set({ error: null }),
}));
