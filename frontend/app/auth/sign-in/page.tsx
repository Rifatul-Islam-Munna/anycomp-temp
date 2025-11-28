"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { mutate, isPending } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: (data: { email: string; password: string }) =>
      loginUser(data.email, data.password),
    onSuccess(data) {
      if (data.error) return toast.error(data.error.message);
      toast.success("Login successfully");
      router.push("/");
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
    console.log("Signin data:", formData);
    // Add your API call here
  };

  return (
    <div className="bg-white h-full min-h-dvh flex justify-center items-center">
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={1} square sx={{ padding: 4, width: "100%" }}>
            <Typography component="h1" variant="h5" textAlign="center" mb={3}>
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isPending}
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className=" text-gray-900">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
