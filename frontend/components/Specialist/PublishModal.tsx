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
}

export default function PublishModal({
  open,
  onClose,
  onConfirm,
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
            <AlertCircle size={32} strokeWidth={2.5} />
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
              Publish changes
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
              Do you want to publish these changes? It will appear in the
              marketplace listing
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
          Continue Editing
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
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
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
