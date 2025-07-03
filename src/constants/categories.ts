// src/constants/categories.ts
import { Category } from '../types/category.types';

export const CATEGORIES: Category[] = [
  // Food & Produce
  {
    id: 'fruitwala',
    name: 'Fruitwala',
    icon: '🍎',
    type: 'product',
  },
  {
    id: 'sabjiwala',
    name: 'Sabjiwala',
    icon: '🥬',
    type: 'product',
  },
  {
    id: 'atalewala',
    name: 'Atalewala',
    icon: '♻️',
    type: 'product',
  },
  {
    id: 'sugarcane',
    name: 'Ganne ka Ras',
    icon: '🥤',
    type: 'product',
  },
  
  // Services
  {
    id: 'mochi',
    name: 'Mochi',
    icon: '👞',
    type: 'service',
  },
  {
    id: 'chainrepair',
    name: 'Chain Repair',
    icon: '🔗',
    type: 'service',
  },
  {
    id: 'gasrepair',
    name: 'Gas Repair',
    icon: '🔥',
    type: 'service',
  },
  {
    id: 'welding',
    name: 'Welding',
    icon: '⚡',
    type: 'service',
  },
  {
    id: 'paan',
    name: 'Paan ki Gumti',
    icon: '🍃',
    type: 'product',
  },
  {
    id: 'gardener',
    name: 'Maali',
    icon: '🌱',
    type: 'service',
  },
  {
    id: 'watchman',
    name: 'Chowkidar',
    icon: '👮',
    type: 'service',
  },
  {
    id: 'driver',
    name: 'Driver',
    icon: '🚗',
    type: 'service',
  },
];

// Common categories for quick access
export const FEATURED_CATEGORIES = [
  'fruitwala',
  'sabjiwala',
  'mochi',
  'gasrepair',
  'sugarcane',
  'chainrepair',
  'atalewala',
  'paan',
];