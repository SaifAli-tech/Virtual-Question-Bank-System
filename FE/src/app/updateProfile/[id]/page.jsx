"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextField, FormControl } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";
import { signOut } from "next-auth/react";

const UpdateProfile = () => {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const {
          _id,
          code,
          role,
          password,
          __v,
          createdAt,
          updatedAt,
          ...updatedFields
        } = values;
        await apiClient.put(`/users/updateProfile/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Profile updated successfully!`,
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
          className="bg-white shadow-md rounded p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Update Profile
          </h2>
          <FormControl fullWidth>
            <TextField
              label="User Name"
              type="text"
              name="name"
              className="mb-4"
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
              className="mb-4"
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
              className="mb-4"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3"
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

export default withAuth(UpdateProfile, ["Admin", "Teacher", "Student"]);
