"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import {
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
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const ChangePassword = () => {
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...updatedFields } = values;
        await apiClient.put(`/users/changePassword/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Password updated successfully!`,
        });
        signOut({ callbackUrl: "http://localhost:4000/login" });
      } catch (error) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: error.response?.data.message || error.message,
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
            Change Password
          </h2>
          <FormControl fullWidth>
            <TextField
              type={showPassword ? "text" : "password"}
              id="password"
              label="New Password"
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
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </Button>
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default withAuth(ChangePassword, ["Admin", "Teacher", "Student"]);
