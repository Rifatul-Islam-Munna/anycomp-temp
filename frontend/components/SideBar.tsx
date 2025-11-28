"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Tag,
  Users,
  ClipboardList,
  PenTool,
  Mail,
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";

// Define the navigation items structure
const MENU_ITEMS = [
  { label: "Specialists", icon: Tag, active: true },
  { label: "Clients", icon: Users, active: false },
  { label: "Service Orders", icon: ClipboardList, active: false },
  { label: "eSignature", icon: PenTool, active: false }, // "Feather" or "PenTool" matches the nib icon
  { label: "Messages", icon: Mail, active: false },
  { label: "Invoices & Receipts", icon: FileText, active: false },
];

const BOTTOM_ITEMS = [
  { label: "Help", icon: HelpCircle },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "#FFFFFF", // White background
        borderRight: "1px solid #E5E7EB", // Light gray border
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-red-hat-display)", // Using your custom font
        p: 2, // Padding around the entire sidebar content
      }}
    >
      {/* --- Header Section --- */}
      <Box sx={{ mb: 4, mt: 1, px: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#111827", // Dark gray/black
            fontSize: "1.1rem",
            mb: 3,
          }}
        >
          Profile
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            alt="Gwen Lam"
            src="/path-to-avatar.jpg" // Replace with your actual image path
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#1F2937",
                lineHeight: 1.2,
              }}
            >
              Gwen Lam
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#002F70", // Gray text for company
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              ST Comp Holdings Sdn Bhd
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* --- Navigation Section --- */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#9CA3AF", // Light gray label
            fontSize: "0.75rem",
            fontWeight: 500,
            px: 2,
            mb: 1,
            display: "block",
          }}
        >
          Dashboard
        </Typography>

        <List sx={{ pt: 0 }}>
          {MENU_ITEMS.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: "8px", // Rounded corners like the image
                  py: 1.2, // Vertical padding matching image height
                  bgcolor: item.active ? "#0F2A54" : "transparent", // Exact Navy Blue for active
                  color: item.active ? "#FFFFFF" : "#4B5563", // White text active, gray inactive
                  "&:hover": {
                    bgcolor: item.active ? "#0F2A54" : "#F3F4F6", // Keep blue on hover if active
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: item.active ? "#FFFFFF" : "#6B7280", // Icon color syncs with text
                  }}
                >
                  <item.icon size={20} strokeWidth={2} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    fontFamily: "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* --- Bottom Section --- */}
      <List>
        {BOTTOM_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: "8px",
                py: 1.2,
                color: "#4B5563",
                "&:hover": { bgcolor: "#F3F4F6" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#6B7280" }}>
                <item.icon size={20} strokeWidth={2} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  fontFamily: "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
