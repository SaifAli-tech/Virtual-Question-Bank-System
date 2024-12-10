"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const EditTopic = () => {
  const router = useRouter();
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchTopicData();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiClient.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopicData = async () => {
    try {
      const response = await apiClient.get(`/topics/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching topic data:", error);
    }
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Topic name is required")
      .matches(
        /^[A-Za-z\s]*$/,
        "Topic name cannot contain any special characters or numbers"
      )
      .min(3, "Topic name must contain atleast 3 characters")
      .max(30, "Topic name must not be longer than 30 characters"),
    subject: Yup.string().required("Subject is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      subject: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { _id, __v, createdAt, updatedAt, ...updatedFields } = values;
        await apiClient.put(`/topics/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Topic "${values.name}" updated successfully!`,
        });
        router.push("/topics");
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
      <div className="w-full min-w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Edit Topic
          </h2>
          <FormControl fullWidth>
            <TextField
              label="Topic Name"
              type="text"
              name="name"
              className="mb-4"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <FormControl className="mb-4">
              <InputLabel id="subject-select-label">Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                name="subject"
                label="Subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.subject && formik.errors.subject && (
                <span className="text-red-500">{formik.errors.subject}</span>
              )}
            </FormControl>
            <div className="col-span-2 flex items-center justify-center mt-5">
              <Button
                type="button"
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mx-3"
                onClick={() => router.push("/Topics")}
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

export default withAuth(EditTopic, ["Admin", "Teacher"]);
