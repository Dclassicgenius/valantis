export interface Item {
  id: string;
  product: string;
  price: number;
  brand: string | null;
}

export type Filter = {
  brand?: string | null;
  name?: string | null;
  price?: number | null;
};

export type FilterParams = {
  brand?: string | null;
  searchQuery?: string | null;
  price?: number | null;
};

export type FilterParameter = "brand" | "product" | "price";
