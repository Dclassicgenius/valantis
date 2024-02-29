import { Pagination } from "@mui/material";
import "./App.css";
import ItemCard from "./components/ItemCard";
import { useAuth, useFilter, useGetItems } from "./hooks/hook";
import SkeletonLoader from "./components/SkeletonLoader";
import SelectFilter from "./components/SelectFilter";
import { useState } from "react";
import useDebounce from "./hooks/useDebounce";
import determineActiveFilter from "./util/determineActiveFilter";
function App() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const initialFilters = {
    brand: "",
    searchQuery: "",
    price: null,
  };

  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearchValue = useDebounce(filters.searchQuery, 500);
  const debouncedPriceValue = useDebounce(filters.price, 500);

  const { activeFilterKey, activeFilterValue } = determineActiveFilter(
    filters,
    debouncedSearchValue,
    debouncedPriceValue
  );

  const { isError, error, data, isFetching } = useGetItems(page, 50);

  const {
    data: filterData,
    isError: isFilterError,
    error: filterError,
    isFetching: isFilterFetching,
  } = useFilter(activeFilterKey, activeFilterValue);

  const currentFilterData =
    filterData?.slice((page - 1) * itemsPerPage, page * itemsPerPage) ?? data;
  const paginationCount = Math.ceil((filterData?.length ?? 0) / itemsPerPage);

  const token = useAuth();
  if (!token) {
    return (
      <div>
        <p>Not Authorized.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="mb-10">
      <div className="w-full bg-drim_brown text-lightText sticky top-0 z-50 py-5">
        <h1 className="text-center text-6xl font-extrabold">Valantis</h1>
      </div>

      <SelectFilter
        initialFilters={initialFilters}
        filters={filters}
        setFilters={handleFiltersChange}
      />

      {(isFetching || isFilterFetching) && (
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lgl:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          <SkeletonLoader cards={50} />
        </div>
      )}
      {isError && <p>Error: {error?.message}</p>}
      {isFilterError && <p>Error: {filterError?.message}</p>}

      {!isFetching && !isFilterFetching && (
        <ItemCard items={currentFilterData || data || []} />
      )}

      <div className="flex justify-center ">
        <Pagination
          variant="outlined"
          shape="rounded"
          size="large"
          count={filterData?.length > 0 ? paginationCount : 20}
          page={page}
          onChange={handlePageChange}
          boundaryCount={5}
        />
      </div>
    </div>
  );
}

export default App;
