import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { AlertCircle } from "lucide-react";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function CreateModel({
  open,
  onClose,
  onConfirm,
  loading = false,
}: PublishModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "24px 32px", // Matches the spacious look
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)", // Soft shadow
          fontFamily: "var(--font-red-hat-display)",
        },
      }}
    >
      <DialogContent sx={{ p: 0, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {/* Exclamation Icon */}
          <Box sx={{ mt: 0.5 }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="#000e26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#000e26" />
              <path d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z" fill="#fff" />
            </svg>
          </Box>

          <Box>
            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "28px",
                color: "#111",
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              create new service
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: "16px",
                color: "#333",
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              Do you want to create new service?
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 0, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#111",
            color: "#111",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "15px",
            borderRadius: "6px",
            padding: "10px 24px",
            borderWidth: "1px",
            minWidth: "160px",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "rgba(0,0,0,0.02)",
              borderWidth: "1px",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#00235B", // Navy Blue
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "15px",
            borderRadius: "6px",
            padding: "10px 24px",
            minWidth: "160px",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#001a45",
              boxShadow: "none",
            },
          }}
        >
          {loading && <AlertCircle size={16} className="mr-2 animate-spin" />}{" "}
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
