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
import { useRouter } from "next/navigation";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { Router } from "next/router";

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("User name is required")
      .matches(
        /^[A-Za-z\s]*$/,
        "User name cannot contain any special characters or numbers"
      )
      .min(3, "User name must contain atleast 3 characters")
      .max(30, "User name must not be longer than 30 characters"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\d{4}-\d{7}$/,
        "Invalid phone number format. Use format: 0300-1234567"
      ),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...userData } = values;
      try {
        await axios.post("http://localhost:3000/auth/register", userData);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Registered successfully!`,
        });
        await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        router.push("/preparation");
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            icon: "error",
            color: "red",
            title: "Oops...",
            text: error.response?.data.message || error.message,
          });
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-full w-3/5">
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
            Sign Up
          </h2>
          <FormControl fullWidth className="grid grid-cols-2 gap-4">
            <TextField
              label="User Name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Email"
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Phone"
              type="text"
              name="phone"
              className="col-span-2"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
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
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="mb-4"
            />
            <div className="col-span-2 flex items-center justify-center">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Up
              </Button>
            </div>
            <Link
              href="/login"
              variant="body2"
              color="primary"
              className="flex col-span-2 justify-end"
            >
              Already have an account? Sign in
            </Link>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
