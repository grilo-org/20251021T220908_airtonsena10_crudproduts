export interface Product {
  id: string;
  title: string;
  description: string;
  status: boolean;
  updatedAt: string;
  thumbnail?: string; // URL da thumbnail
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductInput {
  title: string;
  description: string;
  thumbnail: File | string; // File para upload ou string para URL
}

export interface UpdateProductInput {
  title: string;
  description: string;
  status: boolean;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  filter?: string; // busca por título
}
