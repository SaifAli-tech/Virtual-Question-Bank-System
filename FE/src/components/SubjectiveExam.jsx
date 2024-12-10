"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { Timer } from "@mui/icons-material";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import apiClient from "./ApiClient";

const SubjectiveExamPage = ({ questions, difficulty, onComplete }) => {
  const setQuestionTime = () => {
    if (difficulty === "Easy") {
      return 120;
    }
    if (difficulty === "Medium") {
      return 210;
    }
    if (difficulty === "Hard") {
      return 300;
    }
  };

  const getQuestionScore = () => {
    if (difficulty === "Easy") {
      return 3;
    }
    if (difficulty === "Medium") {
      return 5;
    }
    if (difficulty === "Hard") {
      return 7;
    }
  };

  const quesTime = setQuestionTime();
  const totalScore = getQuestionScore() * questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [timeLeft, setTimeLeft] = useState(quesTime);
  const [timeTaken, setTimeTaken] = useState(Array(questions.length).fill(0));
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const questionIds = questions.map((q) => q._id);
  const [index, setIndex] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion();
          return quesTime; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup timer on unmount
  }, [currentQuestionIndex]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const saveCurrentAnswer = () => {
    const newAnswer =
      currentAnswer.trim() === "" ? "/*Not Answered*/" : currentAnswer;

    // Use functional updates to ensure the state updates are accurate
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = newAnswer;
      return updatedAnswers;
    });

    setTimeTaken((prevTimeTaken) => {
      const updatedTimeTaken = [...prevTimeTaken];
      updatedTimeTaken[currentQuestionIndex] =
        quesTime - timeLeft <= 0 ? quesTime : quesTime - timeLeft;
      return updatedTimeTaken;
    });

    // Enable Next button after saving
    setIsNextDisabled(false);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      saveCurrentAnswer();
      await saveToDatabase();
    } else {
      setCurrentAnswer("");
      setTimeLeft(quesTime);
      setCurrentQuestionIndex(index + 1);
      setIndex(index + 1);

      // Reset button states for the next question
      setIsSaveDisabled(true);
      setIsNextDisabled(true);
    }
  };

  const saveToDatabase = async () => {
    const sanitizedAnswers = answers.map((answer) =>
      answer.trim() === "" ? "/*Not Answered*/" : answer
    );
    const sanitizedTimeTaken = timeTaken.map((time) =>
      time === 0 ? quesTime : time
    );
    try {
      const data = {
        user: session.user._id,
        questions: questionIds,
        givenAnswers: sanitizedAnswers,
        timeTaken: sanitizedTimeTaken,
        totalScore,
      };
      await apiClient.post("/descriptiveExams", data);
      Swal.fire({
        icon: "success",
        color: "green",
        title: "Success",
        text: `Exam submitted successfully.`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: error.response?.data.message || error.message,
        });
      }
    } finally {
      onComplete();
    }
  };

  return (
    <div className="min-h-full min-w-full p-6 bg-white justify-center flex flex-col space-y-6 items-center">
      <Typography
        variant="h6"
        className="font-bold w-full text-center text-blue-500"
      >
        Subjective Exam Practice - Question {currentQuestionIndex + 1} of{" "}
        {questions.length}
      </Typography>

      <div className="flex justify-between items-center border p-4 rounded-md bg-white shadow-sm w-full">
        <Typography className="font-semibold text-black">
          {questions[currentQuestionIndex]?.text}
        </Typography>
        <div className="flex items-center space-x-2 border p-2 rounded-md bg-gray-100">
          <Timer className="text-gray-500" />
          <Typography className="text-gray-600">
            {formatTime(timeLeft)}
          </Typography>
        </div>
      </div>

      <div className="border p-4 rounded-md bg-white shadow-sm w-full">
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) => {
            setCurrentAnswer(e.target.value);
            setIsSaveDisabled(e.target.value.trim() === ""); // Disable Save button if no input
          }}
          className="bg-white"
        />
      </div>

      <div className="flex justify-end items-center w-full space-x-4 mt-4">
        <Button
          onClick={saveCurrentAnswer}
          variant="outlined"
          color="primary"
          disabled={isSaveDisabled}
        >
          Save
        </Button>
        <Button
          onClick={handleNextQuestion}
          variant="contained"
          color="primary"
          disabled={isNextDisabled}
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default SubjectiveExamPage;
