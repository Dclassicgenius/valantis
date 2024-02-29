import InputLabel from "@mui/material/InputLabel";
import MuiInput from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CancelIcon from "@mui/icons-material/Cancel";

import { useGetBrands } from "../hooks/hook";
import { Box, Grid, Slider, styled } from "@mui/material";
import { SearchInput } from "./SearchInput";

const Input = styled(MuiInput)`
  width: 60px;
`;

type Filters = {
  brand?: string;
  searchQuery?: string;
  price?: number | null;
};

interface SelectFilterProps {
  initialFilters: Filters;
  filters: {
    brand: string;
    searchQuery: string;
    price: number | null;
  };
  setFilters: (filters: Filters) => void;
}
const SelectFilter = ({
  filters,
  setFilters,
  initialFilters,
}: SelectFilterProps) => {
  const brands = useGetBrands();

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setFilters({ ...initialFilters, price: newValue as number });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...initialFilters,
      price: event.target.value === "" ? null : Number(event.target.value),
    });
  };

  const handleBlur = () => {
    if (filters.price === null || filters.price < 0) {
      setFilters({ ...filters, price: null });
    } else if (filters.price > 100000) {
      setFilters({ ...filters, price: 100000 });
    }
  };

  const handleBrandChange = (event: SelectChangeEvent) => {
    setFilters({ ...initialFilters, brand: event.target.value });
  };

  const setSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...initialFilters,
      searchQuery: event.target.value,
    });
  };

  const isAnyFilterActive = () => {
    return (
      filters.brand !== initialFilters.brand ||
      filters.searchQuery !== initialFilters.searchQuery ||
      filters.price !== initialFilters.price
    );
  };

  const resetFilters = () => {
    setFilters({ ...initialFilters });
  };

  return (
    <div className="flex justify-between m-7">
      <div>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            onChange={handleBrandChange}
            autoWidth
            label="Brand"
          >
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div>
        <SearchInput
          searchQuery={filters.searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <Box sx={{ width: 250 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof filters.price === "number" ? filters.price : 0}
              onChange={handleSliderChange}
              min={0}
              max={100000}
            />
          </Grid>
          <Grid item>
            <Input
              value={filters.price}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 500,
                min: 0,
                max: 100000,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {isAnyFilterActive() && (
        <CancelIcon
          onClick={resetFilters}
          sx={{ fontSize: 30, cursor: "pointer", color: "black" }}
        />
      )}
    </div>
  );
};

export default SelectFilter;
