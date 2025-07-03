// src/types/category.types.ts
export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'product' | 'service';
  description?: string;
}