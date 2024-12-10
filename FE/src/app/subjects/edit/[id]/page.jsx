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

const EditSubject = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetchSubjectData();
  }, []);

  const fetchSubjectData = async () => {
    try {
      const response = await apiClient.get(`/subjects/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching subject data:", error);
    }
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Subject name is required")
      .matches(
        /^[A-Za-z\s]*$/,
        "Subject name cannot contain any special characters or numbers"
      )
      .min(3, "Subject name must contain atleast 3 characters")
      .max(30, "Subject name must not be longer than 30 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { _id, __v, createdAt, updatedAt, ...updatedFields } = values;
        await apiClient.put(`/subjects/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Subject "${values.name}" updated successfully!`,
        });
        router.push("/subjects");
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
    <div className="flex justify-center items-center h-full w-1/3">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Edit Subject
          </h2>
          <FormControl fullWidth>
            <TextField
              label="Subject Name"
              type="text"
              name="name"
              className="mb-4"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <div className="col-span-2 flex items-center justify-center">
              <Button
                type="button"
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mx-3"
                onClick={() => router.push("/subjects")}
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

export default withAuth(EditSubject, ["Admin", "Teacher"]);
