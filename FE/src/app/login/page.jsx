"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Link,
  Button,
  TextField,
  FormControl,
  IconButton,
  InputAdornment,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          Swal.fire({
            icon: "error",
            color: "red",
            title: "Oops...",
            text: result.error || "Failed to log in. Please try again.",
          });
        } else {
          Swal.fire({
            icon: "success",
            color: "green",
            title: "Success",
            text: "Logged in successfully!",
          });
          router.push("/preparation");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-full w-1/3">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-xl p-8"
        >
          <div className="flex justify-center">
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main" }}
              className="bg-blue-500"
            >
              <LockOutlinedIcon className="text-white" />
            </Avatar>
          </div>
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Login
          </h2>
          <FormControl fullWidth>
            <TextField
              label="Email"
              type="text"
              name="email"
              className="mb-4"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              id="password"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="mb-4"
            />
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign In
              </Button>
            </div>
            <Link
              href="/signup"
              variant="body2"
              color="primary"
              className="flex mt-4 justify-end"
            >
              Don't have an account? Sign up
            </Link>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
