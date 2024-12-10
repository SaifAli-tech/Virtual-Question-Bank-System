"use client";

import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const SubjectivePracticePage = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      onComplete();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-full min-w-full p-6 bg-white flex flex-col space-y-6 items-center">
      <Typography
        variant="h6"
        className="font-bold w-full text-center text-blue-500"
      >
        Descriptive Normal Practice - Question {currentQuestionIndex + 1} of{" "}
        {questions.length}
      </Typography>

      <div className="flex flex-col border p-4 rounded-md bg-white shadow-sm w-full space-y-4">
        <Typography className="font-semibold text-black">
          {questions[currentQuestionIndex]?.text}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="bg-white"
        />

        <Typography className="text-gray-500 italic">
          Hint: {questions[currentQuestionIndex]?.hint || "No hint provided."}
        </Typography>

        {showAnswer && (
          <Typography className="text-green-600 font-bold">
            Correct Answer: {questions[currentQuestionIndex]?.answer}
          </Typography>
        )}
      </div>

      <div className="flex justify-end items-center w-full space-x-4 mt-4">
        {!showAnswer && (
          <Button
            onClick={() => setShowAnswer(true)}
            variant="contained"
            color="primary"
            disabled={!userAnswer.trim()}
          >
            Save
          </Button>
        )}
        <Button
          onClick={handleNextQuestion}
          variant="contained"
          color="secondary"
          disabled={!showAnswer}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SubjectivePracticePage;
