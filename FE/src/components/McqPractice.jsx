"use client";

import React, { useState } from "react";
import {
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const MCQPracticePage = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSave = () => {
    const correctAnswer = questions[currentQuestionIndex]?.answer;
    setShowAnswer(true);
    setIsCorrect(selectedOption === correctAnswer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      onComplete();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  return (
    <div className="min-h-full min-w-full p-6 bg-white flex flex-col space-y-6 items-center">
      <Typography
        variant="h6"
        className="font-bold w-full text-center text-blue-500"
      >
        MCQs Normal Practice - Question {currentQuestionIndex + 1} of{" "}
        {questions.length}
      </Typography>

      <div className="flex flex-col border p-4 rounded-md bg-white shadow-sm w-full space-y-4">
        <Typography className="font-semibold text-black">
          {questions[currentQuestionIndex]?.text}
        </Typography>

        <RadioGroup
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
              className="text-gray-700"
            />
          ))}
        </RadioGroup>

        {showAnswer && (
          <>
            <Typography
              className={`font-bold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "You selected the correct answer!"
                : "You selected the wrong answer."}
            </Typography>
            <Typography className="text-gray-700">
              Correct Answer: {questions[currentQuestionIndex]?.answer}
            </Typography>
          </>
        )}
      </div>

      <div className="flex justify-end items-center w-full space-x-4 mt-4">
        {!showAnswer && (
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!selectedOption}
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

export default MCQPracticePage;
