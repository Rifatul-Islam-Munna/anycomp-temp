"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  CirclePlus,
  Download,
  Edit2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import CustomPagination from "./CustomPagination";
import { useRouter } from "next/navigation";
import CreateModel from "./CreateModal";
import {
  useCommonMutationApi,
  useCommonQuery,
} from "@/api-hook/mutation-common";
import { v4 as uuidv4 } from "uuid";
import { ServiceResponse } from "@/@types/service";

// Tab labels
const TABS = ["All", "Drafts", "Published"];
// =========================
// MEDIA ITEM
// =========================
export interface MediaItem {
  id: string;
  specialists: string;
  file_name: string;
  file_size: number;
  display_order: number;
  mime_type: string;
  media_type: string;
  fileUrl: string;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// =========================
// SPECIALIST ITEM
// =========================
export interface Specialist {
  id: string;
  average_rating: string;
  is_draft: boolean;
  total_number_of_ratings: number;
  title: string;
  slug: string;
  description: string;
  base_price: string;
  platform_fee: string;
  final_price: string;
  verification_status: "pending" | "verified" | "rejected"; // adjust if needed
  is_verified: boolean;
  duration_days: number;
  category: string;
  company_types: string[];
  offerings: string[];
  media: MediaItem[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: string;
}

// =========================
// USER OBJECT
// =========================
export interface User {
  id: string;
  email: string;
  password: string; // hashed password
  name: string;
  phone: string;
  image: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// =========================
// MAIN ITEM IN items[]
// =========================
export interface SpecialistWithUser {
  id: string;
  specialists: string;
  specialist: Specialist;
  user_id: string;
  user: User;
  purchases: number;
  created_at: string;
  updated_at: string;
}

// =========================
// META PAGINATION
// =========================
export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// =========================
// FULL RESPONSE
// =========================
export interface SpecialistResponse {
  items: SpecialistWithUser[];
  meta: Meta;
}

export default function ServiceDashboard() {
  const [tab, setTab] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentRowId, setCurrentRowId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const query = new URLSearchParams();
  if (tab === 1) {
    query.set("is_draft", "true");
  } else if (tab === 2) {
    query.set("is_published", "true");
  }

  console.log("tabs", tab);

  const {
    data,
    isPending: isLoading,
    refetch,
  } = useCommonQuery<SpecialistResponse>(
    ["get-specialists", tab, currentPage],
    `/specialists?page=${currentPage}&${query.toString()}`
  );

  const { mutate, isPending } = useCommonMutationApi({
    method: "POST",
    url: "/specialists",
    successMessage: "Service added successfully",
    onSuccess: (data) => {
      router.push(`/admin/specialists?id=${data?.id}`);
    },
  });
  const { mutate: Delete } = useCommonMutationApi({
    method: "DELETE",
    url: "/specialists",
    successMessage: "Service Deleted successfully",
    onSuccess: (data) => {
      refetch();
    },
  });
  const handelConfirm = () => {
    mutate({ id: uuidv4() });
    console.log("confirm");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRowId(null);
  };

  const handleEdit = (id: string) => {
    console.log("Edit row:", currentRowId);
    router.push(`/admin/specialists?id=${id}`);
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    Delete(id);
    console.log("Delete row:", currentRowId);
    handleMenuClose();
  };

  const handleCheckboxToggle = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ px: 4, pt: 3, fontFamily: "var(--font-red-hat-display)" }}>
      {/* Top Section */}
      <Typography
        sx={{ color: "#9CA3AF", fontSize: "0.85rem", mb: 1.5, fontWeight: 600 }}
      >
        Dashboard &gt; Services
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 1,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={0.5}
            sx={{ fontSize: "2rem", color: "#1F2937" }}
          >
            Specialists
          </Typography>
          <Typography sx={{ color: "#9CA3AF", fontSize: "0.9rem", mt: 0.5 }}>
            Create and publish your services for Client&apos;s & Companies
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "#E5E7EB", mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: "48px",
            "& .MuiTabs-indicator": {
              backgroundColor: "#0F2A54",
              height: 3,
            },
          }}
        >
          {TABS.map((tabLabel) => (
            <Tab
              key={tabLabel}
              label={tabLabel}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#6B7280",
                minHeight: "48px",
                px: 3,
                "&.Mui-selected": {
                  color: "#0F2A54",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Top Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search Services"
          size="small"
          sx={{
            width: 280,
            background: "#F8F7FA",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              fontSize: "0.9rem",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "#E5E7EB",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0F2A54",
              },
            },
          }}
          variant="outlined"
        />
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<CirclePlus size={18} />}
            sx={{
              background: "#0F2A54",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
              py: 1,
              fontSize: "0.95rem",
              boxShadow: "none",
              "&:hover": { background: "#193D67", boxShadow: "none" },
            }}
            onClick={() => setOpen(true)}
          >
            Create
          </Button>
          <CreateModel
            loading={isPending}
            onClose={() => setOpen(false)}
            open={open}
            onConfirm={handelConfirm}
          />
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
              py: 1,
              fontSize: "0.95rem",
              borderColor: "#0F2A54",
              color: "#fff",
              boxShadow: "none",
              background: "#071331",
              "&:hover": { borderColor: "#193D67", background: "#F9FAFB" },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Table Section */}
      <Table sx={{ mt: 0 }}>
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid #E5E7EB" }}>
            <TableCell sx={{ width: 50, py: 2 }} />
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              SERVICE
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              PRICE
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              PURCHASES
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              DURATION
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              APPROVAL STATUS
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              PUBLISH STATUS
            </TableCell>
            <TableCell
              sx={{
                color: "#888888",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 2,
              }}
            >
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width="100%" height={28} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : (data?.items ?? []).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F9FAFB" },
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleCheckboxToggle(row.id)}
                      sx={{
                        color: "#454545",
                        "&.Mui-checked": {
                          color: "#0F2A54",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#454545",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                    }}
                  >
                    {row?.specialist?.title ?? "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#454545",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                    }}
                  >
                    {row?.specialist?.final_price
                      ? `RM ${row.specialist.final_price}`
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#454545",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                    }}
                  >
                    {row?.purchases ?? "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#454545",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                    }}
                  >
                    {row?.specialist?.duration_days
                      ? `${row.specialist.duration_days} Days`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        row?.specialist?.verification_status === "pending"
                          ? "Under-Review"
                          : row?.specialist?.verification_status === "verified"
                          ? "Approved"
                          : row?.specialist?.verification_status === "rejected"
                          ? "Rejected"
                          : "N/A"
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          row?.specialist?.verification_status === "verified"
                            ? "#18C96466"
                            : row?.specialist?.verification_status === "pending"
                            ? "#61E7DA66"
                            : "#FEE2E2",
                        color:
                          row?.specialist?.verification_status === "verified"
                            ? "#1AC623"
                            : row?.specialist?.verification_status === "pending"
                            ? "#00AC95"
                            : "#C00306",
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        borderRadius: "5px",
                        width: "100px",
                        height: "30px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        row?.specialist?.is_draft === false &&
                        row?.specialist?.deleted_at === null
                          ? "Published"
                          : "Not Published"
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          row?.specialist?.is_draft === false &&
                          row?.specialist?.deleted_at === null
                            ? "#18C964"
                            : "#C00306",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        borderRadius: "5px",
                        width: "100px",
                        height: "30px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, row.specialist.id)}
                      size="small"
                      sx={{ color: "#6B7280" }}
                    >
                      <MoreVertical size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <CustomPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={data?.meta?.totalPages ?? 1}
      />

      {/* Action Menu Popup */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            minWidth: 160,
            mt: 0.5,
            width: "300px",
            padding: "0px 0.95rem",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          className="px-2"
          onClick={() => handleEdit(currentRowId!)}
          sx={{ py: 1.5, fontSize: "0.95rem" }}
        >
          <ListItemIcon>
            <Edit2 size={18} color="#1F2937" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#1F2937" }}>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleDelete(currentRowId!)}
          sx={{ py: 1.5, fontSize: "0.95rem" }}
        >
          <ListItemIcon>
            <Trash2 size={18} color="#1F2937" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#1F2937" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
