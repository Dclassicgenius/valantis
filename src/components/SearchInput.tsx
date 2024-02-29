import { TextField, Box } from "@mui/material";

type SearchInputProps = {
  searchQuery: string;
  setSearchQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  return (
    <Box sx={{ backgroundColor: "white", borderRadius: "5px", width: "100%" }}>
      <TextField
        placeholder="Search for a jewelry"
        value={searchQuery}
        onChange={setSearchQuery}
        size="small"
        type="text"
        autoFocus
        sx={{ backgroundColor: "white" }}
      />
    </Box>
  );
}
