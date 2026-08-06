import { useMemo, useState, useEffect } from 'react';
import { Product, FilterState } from '../types';

export const useProductFilter = (products: Product[], filters: FilterState) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }

      // Search filter - instant search across multiple fields
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchSku = product.sku ? product.sku.toLowerCase().includes(query) : false;
        const matchDesc = product.shortDescription.toLowerCase().includes(query) || product.fullDescription.toLowerCase().includes(query);
        const matchIngredients = product.ingredients.some((i) => i.toLowerCase().includes(query));
        const matchBadges = product.badges ? product.badges.some((b) => b.toLowerCase().includes(query)) : false;
        
        if (!matchName && !matchSubtitle && !matchSku && !matchDesc && !matchIngredients && !matchBadges) {
          return false;
        }
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Stock filter
      if (filters.onlyInStock && product.stock <= 0) {
        return false;
      }

      // Badge filter
      if (filters.selectedBadge) {
        const targetBadge = filters.selectedBadge.toLowerCase();
        const hasBadge = product.badges && product.badges.some((b) => b.toLowerCase().includes(targetBadge));
        if (!hasBadge) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return {
    filteredProducts,
    paginatedProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount: filteredProducts.length
  };
};

