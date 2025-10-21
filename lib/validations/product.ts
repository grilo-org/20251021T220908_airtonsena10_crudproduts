import { z } from 'zod';

// Schema para criação de produto
export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  thumbnail: z.union([
    z.instanceof(File, { message: 'Arquivo inválido' }),
    z.string().url('URL inválida').min(1, 'Thumbnail é obrigatória'),
  ]).refine((val) => val !== null && val !== undefined, {
    message: 'Thumbnail é obrigatória (arquivo ou URL)'
  }),
});

// Schema para atualização de produto
export const updateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  status: z.boolean(),
});

// Schema para atualização de thumbnail
export const updateThumbnailSchema = z.object({
  thumbnail: z.union([
    z.instanceof(File, { message: 'Arquivo inválido' }),
    z.string().url('URL inválida').min(1, 'Thumbnail é obrigatória'),
  ]).refine((val) => val !== null && val !== undefined, {
    message: 'Thumbnail é obrigatória (arquivo ou URL)'
  }),
});

// Schema para filtros de busca
export const productFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  filter: z.string().optional(),
});

// Tipos derivados dos schemas
export type CreateProductForm = z.infer<typeof createProductSchema>;
export type UpdateProductForm = z.infer<typeof updateProductSchema>;
export type UpdateThumbnailForm = z.infer<typeof updateThumbnailSchema>;
export type ProductFiltersForm = z.infer<typeof productFiltersSchema>;