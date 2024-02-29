import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonLoader = ({ cards }: { cards: number }) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <Stack key={index} spacing={1} sx={{ borderRadius: "2px" }}>
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    ));
};

export default SkeletonLoader;
