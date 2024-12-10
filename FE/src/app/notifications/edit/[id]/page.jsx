"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextField, FormControl } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const EditNotification = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    try {
      const response = await apiClient.get(`/notifications/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    text: Yup.string().required("Text is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { _id, __v, createdAt, updatedAt, ...updatedFields } = values;
        await apiClient.put(`/notifications/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Notification "${values.title}" updated successfully!`,
        });
        router.push("/notifications");
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
    <div className="flex justify-center items-center h-full w-2/3">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Edit Notification
          </h2>
          <FormControl fullWidth>
            <TextField
              label="Notification Title"
              type="text"
              name="title"
              className="mb-4"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              label="Notification Text"
              type="text"
              name="text"
              className="mb-4"
              multiline
              rows={4}
              value={formik.values.text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.text && Boolean(formik.errors.text)}
              helperText={formik.touched.text && formik.errors.text}
            />
            <div className="flex items-center justify-center">
              <Button
                type="button"
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mx-3"
                onClick={() => router.push("/notifications")}
              >
                Cancel
              </Button>
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

export default withAuth(EditNotification, ["Admin"]);
