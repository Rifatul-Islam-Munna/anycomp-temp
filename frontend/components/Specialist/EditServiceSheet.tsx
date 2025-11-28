import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  TextField,
  Button,
  IconButton,
  MenuItem,
  InputAdornment,
  Chip,
  Select,
  OutlinedInput,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  X,
  ChevronDown,
  UserPlus,
  Landmark,
  FileText,
  Zap,
  MapPin,
  Calendar,
  Award,
  Truck,
  MessageSquare,
  CloudUpload,
  Trash2,
  Info,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { MediaItem, ServiceData } from "@/@types/service";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SERVICE_CATEGORIES = [
  "Incorporation of a new company",
  "Monthly Company Secretary subscription",
  "Opening of Bank Account",
  "Appointment of Secretary",
  "Appointment/Resignation of Director",
  "Change of Nature of Business",
];

const COMPANY_TYPES = [
  {
    label: "Private Limited - Sdn. Bhd.",
    desc: "Most common choice for businesses in Malaysia. Offers limited liability, easy ownership, and is ideal for startups and SMEs",
  },
  {
    label: "Public Limited - Bhd.",
    desc: "Suitable for large businesses planning to raise capital from the public or list on the stock exchange",
  },
];

const ESTIMATED_TIMES = [
  { label: "1 day", value: 1 },
  { label: "2 days", value: 2 },
  { label: "3 days", value: 3 },
  { label: "4 days", value: 4 },
  { label: "5 days", value: 5 },
  { label: "6 days", value: 6 },
  { label: "7 days", value: 7 },
];

const ADDITIONAL_OFFERINGS = [
  {
    label: "Company Secretary Subscription",
    desc: "Enjoy 1 month free Company Secretary Subscription",
    icon: UserPlus,
  },
  {
    label: "Opening of a Bank Account",
    desc: "Complimentary Corporate Bank Account Opening",
    icon: Landmark,
  },
  {
    label: "Access Company Records and SSM Forms",
    desc: "24/7 Secure Access to Statutory Company Records",
    icon: FileText,
  },
  {
    label: "Priority Filing",
    desc: "Documents are prioritized for submission and swift processing - within 24 hours",
    icon: Zap,
  },
  {
    label: "Registered Office Address Use",
    desc: "Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding",
    icon: MapPin,
  },
  {
    label: "Compliance Calendar Setup",
    desc: "Get automated reminders for all statutory deadlines",
    icon: Calendar,
  },
  {
    label: "First Share Certificate Issued Free",
    desc: "Receive your company's first official share certificate at no cost",
    icon: Award,
  },
  {
    label: "CTC Delivery & Courier Handling",
    desc: "Have your company documents and certified copies delivered securely to you",
    icon: Truck,
  },
  {
    label: "Chat Support",
    desc: "Always-On Chat Support for Compliance, Filing, and General Queries",
    icon: MessageSquare,
  },
];

// Use your actual MediaItem type
type MediaFile = MediaItem;

const UploadBox = ({
  label,
  file,
  onFileSelect,
  onDelete,
  loading,
}: {
  label: string;
  file?: MediaFile | null;
  onFileSelect: (file: File) => void;
  onDelete: () => void;
  loading?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSelect(selectedFile);
    }
  };

  const validateAndSelect = (selectedFile: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload JPG, JPEG, PNG or WEBP only");
      return;
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSelect(droppedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getBaseURl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 600, fontSize: 14, mb: 0.5, color: "#111" }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
        <Info size={12} color="#666" />
        <Typography sx={{ fontSize: 11, color: "#666" }}>
          Maximum of 1 image
        </Typography>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {loading ? (
        // Loading skeleton while uploading
        <Box
          sx={{
            height: 140,
            borderRadius: 2,
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            border: "2px dashed #e5e7eb",
          }}
        >
          <CircularProgress size={24} sx={{ color: "#0F2A54" }} />
          <Typography sx={{ fontSize: 12, color: "#6b7280", mt: 1 }}>
            Uploading...
          </Typography>
        </Box>
      ) : file ? (
        // Show uploaded media from backend
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            border: "1px solid #eee",
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: "#f0f0f0",
              overflow: "hidden",
              mr: 1.5,
            }}
          >
            {file.fileUrl && (
              <img
                src={`${getBaseURl}${file.fileUrl}`}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
              {file.file_name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#666" }}>
              Size: {formatFileSize(file.file_size)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#666" }}>
              Type: {file.mime_type || file.media_type}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onDelete} sx={{ color: "#0F2A54" }}>
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ) : (
        // Empty upload area
        <Box
          onClick={handleBrowseClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: isDragging ? "2px dashed #0F2A54" : "2px dashed #e5e7eb",
            borderRadius: 2,
            height: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isDragging ? "#f0f4ff" : "#fafafa",
            cursor: "pointer",
            mb: 1,
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#f3f4f6", borderColor: "#d1d5db" },
          }}
        >
          <CloudUpload size={32} color="#0F2A54" strokeWidth={1.5} />
          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 1.5,
              mb: 0.5,
              bgcolor: "#0F2A54",
              textTransform: "none",
              fontSize: 12,
              minWidth: 80,
              borderRadius: 10,
              boxShadow: "none",
              "&:hover": { bgcolor: "#132753" },
              pointerEvents: "none",
            }}
          >
            Browse
          </Button>
          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>or</Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            Drag a file to upload
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 10, color: "#9ca3af" }}>
          Accepted formats: JPG, JPEG, PNG or WEBP
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#9ca3af" }}>
          Maximum file size: 4MB
        </Typography>
      </Box>
    </Box>
  );
};

export default function EditServiceSheet({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ServiceData | undefined;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [companyTypes, setCompanyTypes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("1");
  const [price, setPrice] = useState("0.00");
  const [offerings, setOfferings] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploadingOrders, setUploadingOrders] = useState<Set<number>>(
    new Set()
  );

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const queryclient = useQueryClient();

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? "");
      setCategory(data.category ?? SERVICE_CATEGORIES[0]);
      setCompanyTypes(data.company_types ?? []);
      setDescription(data.description ?? "");
      setTime(data.duration_days?.toString() ?? "1");
      setPrice(data.base_price ?? "0.00");
      setOfferings(data.offerings ?? []);
      setMedia(data?.media ?? []);
      // Clear uploading states when data refreshes
      setUploadingOrders(new Set());
    }
  }, [data]);

  const { mutate: uploadImage } = useCommonMutationApi({
    method: "POST",
    url: "/specialists/media",
    onSuccess: () => {
      queryclient.refetchQueries({ queryKey: ["service"], exact: false });
    },
  });
  const { mutate: DeleteImage } = useCommonMutationApi({
    method: "DELETE",
    url: "/specialists/media",
    onSuccess: () => {
      queryclient.refetchQueries({ queryKey: ["service"], exact: false });
    },
  });

  // Handle file selection - show loading immediately, upload in background
  const handleFileSelect = (file: File, order: number) => {
    // Show loading state immediately
    setUploadingOrders((prev) => {
      const newSet = new Set(prev);
      newSet.add(order);
      return newSet;
    });

    // Clear any existing media for this order first
    setMedia((prev) => prev.filter((m) => m.display_order !== order));

    const id = uuidv4();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("display_order", order.toString());
    formData.append("specialist_id", search!);
    formData.append("id", id);

    uploadImage(formData);
  };

  // Handle file delete
  const handleFileDelete = (order: number) => {
    const findOne = media.find((m) => m.display_order === order);
    if (!findOne) return;
    const id = findOne.id;
    DeleteImage(id);
    // TODO: Call delete API if needed
    setMedia((prev) => prev.filter((m) => m.display_order !== order));
    setUploadingOrders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(order);
      return newSet;
    });
  };

  // Get media by display_order
  const getMediaByOrder = (order: number) => {
    return media.find((m) => m.display_order === order) || null;
  };

  const handleOfferingChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setOfferings(typeof value === "string" ? value.split(",") : value);
  };

  const handleCompanyTypeChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCompanyTypes(typeof value === "string" ? value.split(",") : value);
  };

  const { mutate, isPending } = useCommonMutationApi({
    method: "PATCH",
    url: `/specialists/${search}`,
    successMessage: "Service updated successfully",
    onSuccess: () => {
      queryclient.refetchQueries({ queryKey: ["service"], exact: false });
      onClose();
    },
  });

  const handelSubmit = () => {
    const payloadData = {
      id: search,
      title: title,
      category: category,
      company_types: companyTypes,
      description: description,
      duration_days: time,
      base_price: price,
      offerings: offerings,
    };
    mutate(payloadData);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: 750 },
          p: 0,
          fontFamily: "var(--font-red-hat-display)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 3,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
          Edit Service
        </Typography>
        <IconButton onClick={onClose}>
          <X size={24} color="#111" />
        </IconButton>
      </Box>

      {/* Form Content */}
      <Box
        sx={{ px: 4, py: 3, display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Title */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Title
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 1, fontSize: 15 },
            }}
          />
        </Box>

        {/* Image Upload Section */}
        <Box>
          <Grid container spacing={2}>
            {[1, 2, 3].map((order) => (
              <Grid key={order} item xs={12} md={4}>
                <UploadBox
                  label={`Service - Image (${
                    order === 1 ? "1st" : order === 2 ? "2nd" : "3rd"
                  })`}
                  file={getMediaByOrder(order)}
                  onFileSelect={(file) => handleFileSelect(file, order)}
                  onDelete={() => handleFileDelete(order)}
                  loading={uploadingOrders.has(order)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Service Category */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Service Category{" "}
            <span style={{ color: "#d32f2f", fontWeight: 400, fontSize: 13 }}>
              Note: Can only choose 1
            </span>
          </Typography>
          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            displayEmpty
            IconComponent={ChevronDown}
            sx={{ borderRadius: 1, fontSize: 15 }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: 14, py: 1.5 }}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Supported Company Types */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Supported Company Types
          </Typography>
          <Select
            fullWidth
            multiple
            value={companyTypes}
            onChange={handleCompanyTypeChange}
            displayEmpty
            IconComponent={ChevronDown}
            renderValue={(selected) => {
              if (selected.length === 0)
                return (
                  <Typography color="#9ca3af" fontSize={15}>
                    Select company types
                  </Typography>
                );
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              );
            }}
            sx={{ borderRadius: 1 }}
          >
            {COMPANY_TYPES.map((type) => (
              <MenuItem
                key={type.label}
                value={type.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 1.5,
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <Typography
                  sx={{ fontWeight: 600, fontSize: 14, color: "#111" }}
                >
                  {type.label}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: "#666", whiteSpace: "normal" }}
                >
                  {type.desc}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Description */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: 15,
                p: 1.5,
              },
            }}
          />
          <Typography
            sx={{ textAlign: "right", fontSize: 12, color: "#666", mt: 0.5 }}
          >
            (500 words)
          </Typography>
        </Box>

        {/* Estimated Completion Time */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Estimated Completion Time (Days)
          </Typography>
          <Select
            fullWidth
            value={time}
            onChange={(e) => setTime(e.target.value as string)}
            IconComponent={ChevronDown}
            sx={{ borderRadius: 1, fontSize: 15 }}
          >
            {ESTIMATED_TIMES.map((t) => (
              <MenuItem
                key={t.label}
                value={t.value.toString()}
                sx={{ fontSize: 14 }}
              >
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Price */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Price
          </Typography>
          <TextField
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#f3f4f6",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      mr: 1,
                    }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg"
                      alt="MY"
                      width="20"
                    />
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 600, color: "#374151" }}
                    >
                      MYR
                    </Typography>
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: 15,
                pl: 1,
              },
            }}
          />
        </Box>

        {/* Additional Offerings */}
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "#111" }}
          >
            Additional Offerings
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={offerings}
              onChange={handleOfferingChange}
              displayEmpty
              IconComponent={ChevronDown}
              input={<OutlinedInput sx={{ borderRadius: 1 }} />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <Typography color="#9ca3af" fontSize={15}>
                      Select offerings
                    </Typography>
                  );
                }
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        onDelete={() => {
                          setOfferings(
                            offerings.filter((item) => item !== value)
                          );
                        }}
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                        sx={{ borderRadius: 1, bgcolor: "#f3f4f6" }}
                      />
                    ))}
                  </Box>
                );
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 400, width: 400 } } }}
            >
              {ADDITIONAL_OFFERINGS.map((item) => (
                <MenuItem
                  key={item.label}
                  value={item.label}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    py: 1.5,
                    whiteSpace: "normal",
                    borderBottom: "1px solid #f9f9f9",
                  }}
                >
                  <Box sx={{ mt: 0.5, color: "#4b5563" }}>
                    <item.icon size={18} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: 14, color: "#111" }}
                    >
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 4, mb: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              color: "#ef4444",
              borderColor: "#e5e7eb",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
              borderRadius: 1,
              "&:hover": { borderColor: "#d1d5db", bgcolor: "#fff" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handelSubmit}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#0F2A54",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
              borderRadius: 1,
              boxShadow: "none",
              "&:hover": { bgcolor: "#132753" },
            }}
            disabled={isPending}
          >
            {isPending && (
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            )}
            Confirm
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
