"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  InputBase,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Container,
  Skeleton,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
// MUI Grid v2
import { Search, Bell, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { BasicUser } from "@/@types/user";
import { getUserInfo } from "@/actions/auth";
import { useCommonQuery } from "@/api-hook/mutation-common";

import { ServiceResponse } from "@/@types/service";
import CustomPagination from "@/components/Specialist/CustomPagination";
import { toast } from "sonner";

type SortBy = "created_at" | "final_price";
type SortOrder = "ASC" | "DESC";

export default function ServiceListingPage() {
  const router = useRouter();
  const [user, SetUser] = useState<BasicUser | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // dropdown menus
  const [priceAnchor, setPriceAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const priceOpen = Boolean(priceAnchor);
  const sortOpen = Boolean(sortAnchor);

  const { data, isPending } = useCommonQuery<ServiceResponse>(
    [
      "get-all-service-for-user",
      page,
      limit,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
    ],
    `/specialists/public?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${
      minPrice !== undefined ? `&minPrice=${minPrice}` : ""
    }${maxPrice !== undefined ? `&maxPrice=${maxPrice}` : ""}`
  );

  useEffect(() => {
    const getUser = async () => {
      const u = await getUserInfo();
      SetUser(u);
    };
    getUser();
  }, []);

  const items = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const formatPrice = (value?: string | null) => {
    if (!value) return "n/A";
    return `RM ${value}`;
  };

  const getFileUrl = (filename: string) => {
    if (!filename) return;
    const getBaseURl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${getBaseURl}${filename}`;
    return url;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        fontFamily: "var(--font-red-hat-display)",
        width: "100%",
      }}
    >
      {/* NAVBAR */}
      <Box sx={{ borderBottom: "1px solid #eee", py: 1.5, bgcolor: "#fff" }}>
        <Container
          maxWidth={false}
          sx={{ maxWidth: "1600px", px: { xs: 2, md: 4 } }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left: Logo & Links */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#0F2A54",
                  letterSpacing: 1,
                }}
              >
                ANYCOMP
              </Typography>
              <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3 }}>
                {[
                  "Register a company",
                  "Appoint a Company Secretary",
                  "Company Secretarial Services",
                  "How Anycomp Works",
                ].map((text) => (
                  <Typography
                    key={text}
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#333",
                      cursor: "pointer",
                    }}
                  >
                    {text}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Right: Search & Profile */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  pl: 2,
                  pr: 0.5,
                  py: 0.5,
                  height: 40,
                  width: 280,
                }}
              >
                <InputBase
                  placeholder="Search for any services"
                  sx={{ fontSize: 14, flex: 1 }}
                />
                <Box
                  sx={{
                    bgcolor: "#0F2A54",
                    borderRadius: "4px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search size={18} color="#fff" />
                </Box>
              </Box>
              <IconButton size="small">
                <Bell size={20} color="#333" />
              </IconButton>
              {user ? (
                <Avatar
                  onClick={() =>
                    user?.role === "admin"
                      ? router.push("/admin")
                      : toast.error("You are not admin")
                  }
                  src="https://placehold.co/40x40"
                  sx={{ width: 32, height: 32, cursor: "pointer" }}
                />
              ) : (
                <Button
                  onClick={() => router.push("/auth/sign-in")}
                  variant="contained"
                  sx={{ textTransform: "none", background: "#0F2A54" }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container
        maxWidth={false}
        sx={{ maxWidth: "1600px", py: 4, px: { xs: 2, md: 4 } }}
      >
        {/* Breadcrumbs */}
        <Typography sx={{ fontSize: 13, color: "#666", mb: 1 }}>
          <span style={{ opacity: 0.5 }}>🏠</span> &nbsp;/&nbsp;
          <span style={{ fontWeight: 600 }}> Specialists </span>
          &nbsp;/&nbsp;
          <span style={{ color: "#555" }}>Register a New Company</span>
        </Typography>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#111", mb: 0.5, fontSize: 40 }}
          >
            Register a New Company
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#777" }}>
            Get Your Company Registered with a Trusted Specialists
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 4 }}>
          {/* Price dropdown */}
          <Button
            variant="outlined"
            endIcon={<ChevronDown size={16} />}
            sx={{
              textTransform: "none",
              color: "#333",
              borderColor: "#ddd",
              borderRadius: "8px",
              px: 2,
            }}
            onClick={(e) => setPriceAnchor(e.currentTarget)}
          >
            Price
          </Button>

          {/* Sort by dropdown */}
          <Button
            variant="outlined"
            endIcon={<ChevronDown size={16} />}
            sx={{
              textTransform: "none",
              color: "#333",
              borderColor: "#ddd",
              borderRadius: "8px",
              px: 2,
            }}
            onClick={(e) => setSortAnchor(e.currentTarget)}
          >
            Sort by
          </Button>
        </Box>

        {/* Price menu */}
        <Menu
          anchorEl={priceAnchor}
          open={priceOpen}
          onClose={() => setPriceAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setSortBy("final_price");
              setSortOrder("ASC");
              setPage(1);
              setPriceAnchor(null);
            }}
          >
            Price: Low to High
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy("final_price");
              setSortOrder("DESC");
              setPage(1);
              setPriceAnchor(null);
            }}
          >
            Price: High to Low
          </MenuItem>
        </Menu>

        {/* Sort-by menu */}
        <Menu
          anchorEl={sortAnchor}
          open={sortOpen}
          onClose={() => setSortAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setSortBy("created_at");
              setSortOrder("DESC");
              setPage(1);
              setSortAnchor(null);
            }}
          >
            Newest
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy("final_price");
              setPage(1);
              setSortAnchor(null);
            }}
          >
            Price
          </MenuItem>
        </Menu>

        {/* Grid */}
        {/* Grid */}
        {/* Replace the entire Grid section with this */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isPending
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="w-full">
                  <Card
                    sx={{
                      boxShadow: "none",
                      bgcolor: "transparent",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={180}
                      sx={{ borderRadius: "12px", mb: 1.5 }}
                    />
                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width="40%" height={18} />
                        <Skeleton variant="text" width="30%" height={16} />
                      </Box>
                      <Skeleton
                        variant="text"
                        width="90%"
                        height={18}
                        sx={{ mb: 0.5 }}
                      />
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={18}
                        sx={{ mb: 0.5 }}
                      />
                      <Skeleton variant="text" width="40%" height={20} />
                    </CardContent>
                  </Card>
                </div>
              ))
            : items.map((service) => (
                <div
                  key={service.id}
                  className="w-full cursor-pointer"
                  onClick={() => router.push(`/`)}
                >
                  <div className="flex flex-col h-full">
                    {/* Image container with fixed aspect ratio */}
                    <div className="relative w-full mb-4 rounded-xl overflow-hidden bg-gray-100">
                      <div className="aspect-[4/3]">
                        <img
                          src={
                            getFileUrl(service?.media?.[0]?.fileUrl) ??
                            "https://placehold.co/600x400/png?text=Service"
                          }
                          alt={service.title ?? "Service"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={
                            service.media?.[0]?.thumbnail ??
                            "https://placehold.co/100x100/png?text=SP"
                          }
                          alt="avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-gray-900">
                          {service.title ?? "n/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          - {service.category ?? "n/A"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-2 line-clamp-2 font-medium leading-snug">
                        {service.description ?? "n/A"}
                      </p>

                      <p className="text-base font-bold text-gray-900">
                        {formatPrice(service.final_price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <Box sx={{ mt: 4 }}>
          <CustomPagination
            totalPages={totalPages}
            currentPage={page}
            setCurrentPage={setPage}
          />
        </Box>
      </Container>
    </Box>
  );
}
