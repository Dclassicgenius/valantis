import { FilterParameter } from "../types";

interface Filters {
  brand?: string;
  searchQuery?: string;
  price?: number | null;
}
const determineActiveFilter = (
  filters: Filters,
  debouncedSearchValue: string | number | null,
  debouncedPriceValue: number | string | null
): {
  activeFilterKey: FilterParameter | null;
  activeFilterValue: string | number | null;
} => {
  let activeFilterKey: FilterParameter | null = null;
  let activeFilterValue: string | number | null = null;

  if (filters.searchQuery) {
    activeFilterKey = "product";
    activeFilterValue = debouncedSearchValue;
  } else if (filters.price !== null) {
    activeFilterKey = "price";
    activeFilterValue = debouncedPriceValue;
  } else if (filters.brand) {
    activeFilterKey = "brand";
    activeFilterValue = filters.brand;
  }

  return { activeFilterKey, activeFilterValue };
};

export default determineActiveFilter;
