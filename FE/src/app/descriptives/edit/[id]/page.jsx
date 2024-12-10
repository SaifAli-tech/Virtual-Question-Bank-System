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

const EditDescriptiveQuestion = () => {
  const router = useRouter();
  const { id } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchDescriptiveQuestionData();
    fetchTopics();
  }, []);

  const fetchDescriptiveQuestionData = async () => {
    try {
      const response = await apiClient.get(`/descriptives/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching descriptive question data:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await apiClient.get("/topics");
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    text: Yup.string().required("Descriptive question text is required"),
    answer: Yup.string().required("Answer text is required"),
    hint: Yup.string().optional("Hint is an optional field"),
    topic: Yup.string().required("Topic is required"),
    difficulty: Yup.string().required("Difficulty is required"),
  });

  const formik = useFormik({
    initialValues: {
      text: "",
      answer: "",
      hint: "",
      topic: "",
      difficulty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { _id, __v, createdAt, updatedAt, ...updatedFields } = values;
        await apiClient.put(`/descriptives/${id}`, updatedFields);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Descriptive question "${values.text}" updated successfully!`,
        });
        router.push("/descriptives");
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
    <div className="flex justify-center items-center h-full w-3/4">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-xl p-6"
        >
          <h2 className="text-center text-2xl font-bold mb-8 text-blue-500">
            Edit Descriptive Question
          </h2>
          <FormControl fullWidth className="grid grid-cols-2 gap-3">
            <TextField
              label="Descriptive Question Text"
              type="text"
              name="text"
              className="mb-2 col-span-2"
              multiline
              rows={2}
              value={formik.values.text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.text && Boolean(formik.errors.text)}
              helperText={formik.touched.text && formik.errors.text}
            />
            <TextField
              label="Answer"
              type="text"
              name="answer"
              className="mb-2 col-span-2"
              multiline
              rows={2}
              value={formik.values.answer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.answer && Boolean(formik.errors.answer)}
              helperText={formik.touched.answer && formik.errors.answer}
            />
            <TextField
              label="Hint"
              type="text"
              name="hint"
              className="mb-2 col-span-2"
              value={formik.values.hint}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.hint && Boolean(formik.errors.hint)}
              helperText={formik.touched.hint && formik.errors.hint}
            />
            <FormControl className="mb-2 mr-1">
              <InputLabel id="topic-select-label">Topic</InputLabel>
              <Select
                labelId="topic-select-label"
                name="topic"
                value={formik.values.topic}
                label="Topic"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.topic && Boolean(formik.errors.topic)}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic._id} value={topic._id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
              <span className="text-red-500">
                {formik.touched.topic && formik.errors.topic}
              </span>
            </FormControl>
            <FormControl className="mb-2 ml-1">
              <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-select-label"
                name="difficulty"
                value={formik.values.difficulty}
                label="Difficulty"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.difficulty && Boolean(formik.errors.difficulty)
                }
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
              <span className="text-red-500">
                {formik.touched.difficulty && formik.errors.difficulty}
              </span>
            </FormControl>
            <div className="col-span-2 flex items-center justify-center">
              <Button
                type="button"
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mx-3"
                onClick={() => router.push("/descriptives")}
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

export default withAuth(EditDescriptiveQuestion, ["Admin", "Teacher"]);
