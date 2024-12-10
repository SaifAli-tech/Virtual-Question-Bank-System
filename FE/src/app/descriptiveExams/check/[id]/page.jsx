"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const ExamCheckPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState([]);

  const currentQuestion = questions[currentQuestionIndex] || {};

  useEffect(() => {
    fetchDescriptiveExamData();
  }, []);

  const fetchDescriptiveExamData = async () => {
    try {
      const response = await apiClient.get(`/descriptiveExams/${id}`);
      const { data } = response;
      setExam(data);
      setQuestions(data.questions || []);
      setScores(
        data.acquiredScores.length > 0
          ? data.acquiredScores
          : Array(data.questions.length).fill(0)
      );
    } catch (error) {
      console.error("Error fetching descriptive exam data:", error);
    }
  };

  const getQuesScore = () => {
    if (!exam || !questions.length) return 0;
    return exam.totalScore / questions.length;
  };

  const handleScoreChange = (e) => {
    const updatedScores = [...scores];
    updatedScores[currentQuestionIndex] = Number(e.target.value);
    setScores(updatedScores);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        acquiredScores: scores,
        status: "Checked",
        checkedAt: new Date().toISOString(),
      };
      console.log(data);
      await apiClient.put(`/descriptiveExams/${id}`, data);
      Swal.fire({
        icon: "success",
        color: "green",
        title: "Success",
        text: "Descriptive Exam checked successfully!",
      });
      router.push("/descriptiveExams");
    } catch (error) {
      Swal.fire({
        icon: "error",
        color: "red",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  if (!exam || !questions.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl text-blue-500 text-center font-bold mb-4">
        Exam Check Page
      </h1>
      <h1 className="text-xl text-blue-500 text-center font-bold mb-4">
        Question {currentQuestionIndex + 1} out of {questions.length}
      </h1>
      <div className="mb-4">
        <div className="p-4 border border-gray-600 rounded-md mb-4">
          <h2 className="text-blue-600 font-semibold">Question:</h2>
          <p className="text-gray-700">{currentQuestion.text}</p>
        </div>
        <div className="p-4 border border-gray-600 rounded-md mb-4 bg-gray-50">
          <h2 className="text-blue-600 font-semibold">Given Answer:</h2>
          <p className="text-gray-700">
            {exam.givenAnswers[currentQuestionIndex]}
          </p>
        </div>
        <div className="p-4 border border-gray-600 rounded-md bg-gray-100">
          <h2 className="text-blue-600 font-semibold">Correct Answer:</h2>
          <p className="text-gray-700">{currentQuestion.answer}</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <p className="font-semibold text-gray-700 mr-4">Score:</p>
          <input
            type="text"
            value={scores[currentQuestionIndex] || 0}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numeric input
              if (/^\d*$/.test(value)) {
                const numericValue = parseInt(value, 10) || 0;
                // Ensure value stays within range
                if (numericValue <= getQuesScore() && numericValue >= 0) {
                  handleScoreChange({ target: { value: numericValue } });
                }
              }
            }}
            className="w-20 px-2 py-1 border text-gray-600 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-600">/ {getQuesScore()}</span>
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestionIndex === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default withAuth(ExamCheckPage, ["Admin", "Teacher"]);
