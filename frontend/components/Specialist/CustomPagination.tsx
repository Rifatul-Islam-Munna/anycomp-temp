import React from "react";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CustomPaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export default function CustomPagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: CustomPaginationProps) {
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        py: 4,
        fontFamily: "var(--font-red-hat-display)",
      }}
    >
      <Pagination
        count={totalPages} // total pages from props
        page={currentPage} // controlled current page
        onChange={handleChange} // update parent state
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: () => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ChevronLeft size={20} strokeWidth={2.5} />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      fontFamily: "inherit",
                    }}
                  >
                    Previous
                  </Typography>
                </Box>
              ),
              next: () => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      fontFamily: "inherit",
                    }}
                  >
                    Next
                  </Typography>
                  <ChevronRight size={20} strokeWidth={2.5} />
                </Box>
              ),
            }}
            {...item}
            sx={{
              fontFamily: "var(--font-red-hat-display)",
              fontSize: 16,
              fontWeight: 500,
              margin: "0 4px",
              "&.Mui-selected": {
                backgroundColor: "#0F2A54",
                color: "#fff",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#132753",
                },
              },
              "&.MuiPaginationItem-previousNext": {
                margin: "0 20px",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
}
