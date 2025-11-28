"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Avatar,
  Grid,
  Skeleton,
  Chip,
} from "@mui/material";
import EditServiceSheet from "./EditServiceSheet";
import {
  useCommonMutationApi,
  useCommonQuery,
} from "@/api-hook/mutation-common";
import { useSearchParams } from "next/navigation";
import { ServiceData } from "@/@types/service";
import { useQueryClient } from "@tanstack/react-query";
import PublishModal from "./PublishModal";

export default function ServiceDetailsExact() {
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const { data, isPending } = useCommonQuery<ServiceData>(
    ["service"],
    `/specialists/${search}`
  );
  const [isPublishModelOpen, setIsPublishModelOpen] = React.useState(false);

  const handelClose = () => {
    setOpen(false);
  };
  const fileWithUrl = (order: number) => {
    const getBaseURl = process.env.NEXT_PUBLIC_BASE_URL;

    const findOne = data?.media.find((m) => m.display_order === order);
    if (!findOne) return;
    const url = `${getBaseURl}${findOne.fileUrl}`;

    return url;
  };

  const queryclient = useQueryClient();
  const { mutate } = useCommonMutationApi({
    method: "PATCH",
    url: `/specialists/${search}`,
    successMessage: "Service updated successfully",
    onSuccess: () => {
      queryclient.refetchQueries({ queryKey: ["service"], exact: false });
      setIsPublishModelOpen(false);
    },
  });
  const handelPublish = () => {
    mutate({
      is_draft: false,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        fontFamily: "var(--font-red-hat-display)",
        bgcolor: "#fff",
        px: { xs: 2, lg: 6 },
        pt: 4,
        pb: 8,
      }}
    >
      <PublishModal
        open={isPublishModelOpen}
        onClose={() => setIsPublishModelOpen(false)}
        onConfirm={handelPublish}
      />
      {/* Title */}
      {isPending ? (
        <Skeleton variant="text" width="80%" height={50} sx={{ mb: 3 }} />
      ) : (
        <Typography
          sx={{ fontWeight: 700, fontSize: 30, mb: 3, color: "#111" }}
        >
          {data?.title || "Untitled Service"}
        </Typography>
      )}

      {/* Main Layout Grid */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: { xs: 4, md: 3, lg: 4 },
          width: "100%",
        }}
      >
        {/* LEFT: Image Grid - FULL WIDTH */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 1fr)",
            gridTemplateRows: "220px 220px",
            gap: 2,
            flex: "1 1 60%",
            minWidth: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              gridRow: "1 / span 2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#F4F4F4",
              borderRadius: 2,
              flexDirection: "column",
              color: "#8d8d8d",
              p: 2,
              border: "none",
              height: "100%",
            }}
          >
            {fileWithUrl(1) ? (
              <img
                alt="Office Discussion"
                src={fileWithUrl(1)}
                style={{ width: "100%", height: "100%", objectFit: "fill" }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#7b7b7b",
                  textAlign: "center",
                  maxWidth: 200,
                }}
              >
                Upload an image for your service listing in PNG, JPG or JPEG
                <br />
                up to 4MB
              </Typography>
            )}
          </Paper>

          <Box
            sx={{
              height: "100%",
              bgcolor: "#ddd",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <img
              alt="Company Secretarial"
              src={fileWithUrl(2) ?? "https://placehold.co/600x400.png"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box
            sx={{
              height: "100%",
              bgcolor: "#ddd",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <img
              alt="Office Discussion"
              src={fileWithUrl(3) ?? "https://placehold.co/600x400.png"}
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
            />
          </Box>
        </Box>

        {/* RIGHT: Fee Card Section - FULL WIDTH */}
        <Box
          sx={{
            flex: "1 1 40%",
            minWidth: 380,
          }}
        >
          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              mb: 1,
              justifyContent: "flex-start",
            }}
          >
            <Button
              onClick={() => setOpen(true)}
              sx={{
                px: 4,
                py: 1,
                bgcolor: "#111827",
                color: "#fff",
                borderRadius: "6px ",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 14,
                boxShadow: "none",
                minWidth: 100,
                "&:hover": { bgcolor: "#000" },
              }}
            >
              Edit
            </Button>
            <EditServiceSheet data={data} open={open} onClose={handelClose} />
            <Button
              sx={{
                px: 4,
                py: 1,
                bgcolor: "#0F2A54",
                color: "#fff",
                borderRadius: "6px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 14,
                boxShadow: "none",
                ml: "-2px",
                minWidth: 100,
                "&:hover": { bgcolor: "#132753" },
              }}
              onClick={() => setIsPublishModelOpen(true)}
            >
              Publish
            </Button>
          </Box>

          {/* Fee Card */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: "8px",
              p: 4,
              width: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            {isPending ? (
              <>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  sx={{ mb: 3 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  sx={{ mb: 4, borderRadius: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  sx={{ mb: 2 }}
                />
                <Skeleton variant="text" width="100%" height={20} />
              </>
            ) : (
              <>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 24, mb: 1, color: "#000" }}
                >
                  Professional Fee
                </Typography>
                <Typography sx={{ color: "#666", mb: 3, fontSize: 15 }}>
                  Set a rate for your service
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 32,
                    mb: 4,
                    textAlign: "center",
                    borderBottom: "3px solid #000",
                    display: "inline-block",
                    pb: 1,
                    width: "100%",
                    maxWidth: 200,
                    mx: "auto",
                    display: "block",
                  }}
                >
                  RM{" "}
                  {data?.final_price
                    ? parseFloat(data.final_price).toFixed(2)
                    : "0.00"}
                </Typography>

                {/* Price List */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontSize: 15, color: "#333", fontWeight: 500 }}
                    >
                      Base price
                    </Typography>
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 600 }}
                    >
                      RM{" "}
                      {data?.base_price
                        ? parseFloat(data.base_price).toFixed(2)
                        : "0.00"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        color: "#333",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Service processing fee
                    </Typography>
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 600 }}
                    >
                      RM{" "}
                      {data?.platform_fee
                        ? parseFloat(data.platform_fee).toFixed(2)
                        : "0.00"}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 600 }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 600 }}
                    >
                      RM{" "}
                      {data?.final_price
                        ? parseFloat(data.final_price).toFixed(2)
                        : "0.00"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 700 }}
                    >
                      Your returns
                    </Typography>
                    <Typography
                      sx={{ fontSize: 15, color: "#000", fontWeight: 700 }}
                    >
                      RM{" "}
                      {data?.base_price
                        ? parseFloat(data.base_price).toFixed(2)
                        : "0.00"}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Service Info Section */}
      {isPending ? (
        <Box sx={{ mt: 6, width: "100%", pr: { md: "400px" } }}>
          <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="95%" height={20} />
        </Box>
      ) : (
        <>
          {/* Category & Company Types */}
          {(data?.category ||
            data?.duration_days ||
            (data?.company_types && data.company_types.length > 0)) && (
            <Box sx={{ mt: 6, width: "100%", pr: { md: "400px" } }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: 20, mb: 2, color: "#000" }}
              >
                Service Details
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                {data?.category && (
                  <Box>
                    <Typography sx={{ fontSize: 14, color: "#666", mb: 1 }}>
                      Category
                    </Typography>
                    <Chip label={data.category} color="primary" />
                  </Box>
                )}
                {data?.duration_days && (
                  <Box>
                    <Typography sx={{ fontSize: 14, color: "#666", mb: 1 }}>
                      Duration
                    </Typography>
                    <Chip
                      label={`${data.duration_days} days`}
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
              {data?.company_types && data.company_types.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 14, color: "#666", mb: 1 }}>
                    Company Types
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {data.company_types.map((type, index) => (
                      <Chip
                        key={index}
                        label={type}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              <Divider sx={{ borderColor: "#eee", mt: 3 }} />
            </Box>
          )}

          {/* Description Section */}
          {data?.description && (
            <Box sx={{ mt: 4, width: "100%", pr: { md: "400px" } }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: 20, mb: 1, color: "#000" }}
              >
                Description
              </Typography>
              <Typography
                sx={{ color: "#444", fontSize: 16, mb: 2, lineHeight: 1.6 }}
              >
                {data.description}
              </Typography>
              <Divider sx={{ borderColor: "#eee" }} />
            </Box>
          )}

          {/* Additional Offerings */}
          {data?.offerings && data.offerings.length > 0 && (
            <Box sx={{ mt: 3, width: "100%", pr: { md: "400px" } }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: 20, mb: 2, color: "#000" }}
              >
                Additional Offerings
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {data.offerings.map((offering, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#0F2A54",
                      }}
                    />
                    <Typography sx={{ color: "#444", fontSize: 16 }}>
                      {offering}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ borderColor: "#eee", mt: 3 }} />
            </Box>
          )}
        </>
      )}

      {/* Company Secretary Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          mt: 6,
          gap: 8,
          width: "100%",
        }}
      >
        {/* Secretary Profile */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 20, mb: 3, color: "#000" }}
          >
            Company Secretary
          </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Avatar
              src="https://placehold.co/100x100/png?text=GL"
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: 16, color: "#000" }}
                >
                  Grace Lam
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#22c55e",
                    color: "#fff",
                    px: 1,
                    borderRadius: "4px",
                    fontSize: 12,
                    fontWeight: 600,
                    py: 0.2,
                  }}
                >
                  Verified
                </Box>
              </Box>
              <Typography sx={{ color: "#444", fontSize: 14, mb: 1 }}>
                Corpsec Services Sdn Bhd
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#0F2A54",
                  color: "#fff",
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  px: 2,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#132753" },
                }}
              >
                View Profile
              </Button>
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#444",
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: "800px",
            }}
          >
            A company secretarial service founded by Grace, who believes that
            every company deserves clarity, confidence, and care in their
            compliance journey. Inspired by the spirit of entrepreneurship, Aida
            treats every client's business as if it were her own - attentive to
            detail, committed to deadlines, and focused on growth.
          </Typography>
        </Box>

        {/* Certified Card */}
        <Paper
          elevation={0}
          sx={{
            p: 0,
            minWidth: 250,
            bgcolor: "transparent",
          }}
        >
          <Typography
            sx={{ fontWeight: 700, fontSize: 16, mb: 2, color: "#000" }}
          >
            Certified Company Secretary
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <img
              src="https://placehold.co/60x40/png?text=SSM"
              alt="Cert1"
              style={{ height: 40 }}
            />
            <img
              src="https://placehold.co/60x40/png?text=MAICSA"
              alt="Cert2"
              style={{ height: 40 }}
            />
            <img
              src="https://placehold.co/60x40/png?text=MIA"
              alt="Cert3"
              style={{ height: 40 }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
