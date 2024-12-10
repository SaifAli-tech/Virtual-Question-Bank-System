"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const AddMcq = () => {
  const router = useRouter();
  const [choices, setChoices] = useState(["", ""]);
  const [topics, setTopics] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await apiClient.get("/topics");
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
    formik.setFieldValue("options", updatedChoices);
  };

  const addChoice = () => {
    if (choices.length < 4) setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    if (choices.length > 2) {
      const updatedChoices = choices.filter((_, i) => i !== index);
      setChoices(updatedChoices);
      formik.setFieldValue("options", updatedChoices);
      if (correctAnswer === choices[index]) setCorrectAnswer("");
    }
  };

  const validationSchema = Yup.object().shape({
    text: Yup.string().required("MCQ text is required"),
    options: Yup.array()
      .of(Yup.string().required("Each option is required"))
      .min(2, "At least 2 options are required")
      .max(4, "More than 4 options are not allowed"),
    topic: Yup.string().required("Topic is required"),
    difficulty: Yup.string().required("Difficulty is required"),
  });

  const formik = useFormik({
    initialValues: {
      text: "",
      options: choices,
      topic: "",
      difficulty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const McqData = { ...values, answer: correctAnswer };
        await apiClient.post("/mcqs", McqData);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `MCQ "${values.text}" added successfully!`,
        });
        formik.resetForm();
        setChoices(["", ""]);
        setCorrectAnswer("");
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
            Add MCQ
          </h2>
          <FormControl fullWidth className="grid grid-cols-2 gap-3">
            <TextField
              label="MCQ Text"
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
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center mb-2 col-span-2">
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                />
                <IconButton
                  color="primary"
                  onClick={addChoice}
                  disabled={choices.length === 4}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => removeChoice(index)}
                  disabled={choices.length === 2}
                >
                  <Remove />
                </IconButton>
              </div>
            ))}
            {formik.touched.options && formik.errors.options && (
              <div className="text-red-500 text-sm col-span-2">
                {formik.errors.options}
              </div>
            )}
            <FormControl component="fieldset" className="col-span-2">
              <FormLabel component="legend">
                Select the Correct Answer
              </FormLabel>
              <RadioGroup
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                {choices.map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice}
                    control={<Radio />}
                    label={`Option ${index + 1}: ${choice}`}
                    disabled={!choice}
                    className="text-black"
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <div className="flex gap-3 col-span-2">
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-select-label"
                  name="difficulty"
                  value={formik.values.difficulty}
                  label="Difficulty"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.difficulty &&
                    Boolean(formik.errors.difficulty)
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
            </div>
            <div className="col-span-2 flex items-center justify-center mt-4">
              <Button
                type="button"
                className="bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mx-3"
                onClick={() => router.push("/mcqs")}
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

export default withAuth(AddMcq, ["Admin", "Teacher"]);
