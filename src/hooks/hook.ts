import { useState, useEffect } from "react";
import axios from "axios";
import md5 from "md5";
import { FilterParameter, Item } from "../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const api = axios.create({
  baseURL: "https://api.valantis.store:40000/",
});

export const useAuth = (): string | null => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const generateToken = () => {
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const hash = md5(`Valantis_${timestamp}`);
      return hash;
    };

    setToken(generateToken());
  }, []);

  api.defaults.headers.common["X-Auth"] = token;

  return token;
};

const getData = async (ids: string[]) => {
  if (ids) {
    const { data: itemsData } = await api.post("", {
      action: "get_items",
      params: { ids: ids },
    });

    return itemsData?.result || [];
  }
};

const fetchItems = async (page = 1, itemsPerPage = 50) => {
  let offset = (page - 1) * itemsPerPage;
  let fetchedItems: Item[] = [];

  while (fetchedItems.length < itemsPerPage) {
    const { data } = await api.post("/", {
      action: "get_ids",
      params: { offset, limit: 1000 },
    });

    const ids = data?.result;

    const itemsData = await getData(ids);

    const uniqueItems = filterOutDuplicates(itemsData || [], fetchedItems);

    fetchedItems = [...fetchedItems, ...uniqueItems];

    offset += itemsPerPage;
  }

  return fetchedItems.slice(0, itemsPerPage);
};

export const useGetItems = (
  ...params: [page: number, itemsPerPage: number]
) => {
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["items", ...params],
      queryFn: () => fetchItems(...params),
      retry: 5,
      placeholderData: keepPreviousData,
      retryDelay: 3000,
    });

  return { isPending, isError, error, data, isFetching, isPlaceholderData };
};

const filterOutDuplicates = (
  newItems: Item[],
  existingItems: Item[]
): Item[] => {
  const encounteredIds = new Set<string>(existingItems.map((item) => item.id));
  const uniqueItems: Item[] = [];

  for (const item of newItems) {
    if (!encounteredIds.has(item.id)) {
      encounteredIds.add(item.id);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
};

export const useGetBrands = () => {
  const [brand, setBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await api.post("/", {
        action: "get_fields",
        params: { field: "brand" },
      });

      const uniqueBrands: string[] = Array.from(new Set(data?.result || []));
      setBrands(uniqueBrands || []);
    };
    fetchBrands();
  }, []);

  return brand;
};

const filter = async (
  field: FilterParameter | null,
  value: string | number | null
) => {
  if (value === null || !field) {
    return;
  }

  try {
    const response = await api.post("", {
      action: "filter",
      params: { [field]: value },
    });

    const filterResult = await getData(response.data.result);

    return filterResult;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    return [];
  }
};

export const useFilter = (
  field: FilterParameter | null,
  value: string | number | null
) => {
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["filter", value],
      queryFn: () => filter(field, value),
      retry: 5,
      retryDelay: 3000,
      enabled: field !== null && value !== null,
    });

  return { isPending, isError, error, data, isFetching, isPlaceholderData };
};
