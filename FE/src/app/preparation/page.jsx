"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Alert,
} from "@mui/material";
import apiClient from "@/components/ApiClient.jsx";
import SubjectiveExamPage from "@/components/SubjectiveExam.jsx";
import SubjectivePracticePage from "@/components/SubjectivePractice.jsx";
import McqPracticePage from "@/components/McqPractice.jsx";
import McqExamPage from "@/components/McqExam.jsx";

const PreparationPage = () => {
  const [descriptives, setDescriptives] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPracticePage, setShowPracticePage] = useState(false);

  const noOfQues = [5, 10];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) fetchTopics();
    else setTopics([]);
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const subjectRecords = await apiClient.get("/subjects");
      setSubjects(subjectRecords.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const topicRecords = await apiClient.get(
        `/topics/topicsBySubject/${selectedSubject}`
      );
      setTopics(topicRecords.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleStartPractice = async () => {
    if (
      !selectedSubject ||
      !selectedTopic ||
      !questionType ||
      !selectedDifficulty ||
      !practiceType
    ) {
      setErrorMessage("All fields are required to start the practice session.");
      return;
    }

    setErrorMessage("");

    try {
      if (questionType === "MCQs") {
        const response = await apiClient.get(
          `/mcqs/getQuestions?topic=${selectedTopic}&difficulty=${selectedDifficulty}&quantity=${numberOfQuestions}`
        );
        setMcqs(response.data);
        setShowPracticePage(true);
      } else if (questionType === "Descriptive Questions") {
        const response = await apiClient.get(
          `/descriptives/getQuestions?topic=${selectedTopic}&difficulty=${selectedDifficulty}&quantity=${numberOfQuestions}`
        );
        setDescriptives(response.data);
        setShowPracticePage(true);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handlePracticeCompletion = () => {
    setShowPracticePage(false);
  };

  const getPracticeComponent = () => {
    if (practiceType === "Normal Non-Timed Constrained") {
      if (questionType === "Descriptive Questions") {
        return (
          <SubjectivePracticePage
            questions={descriptives}
            onComplete={handlePracticeCompletion}
          />
        );
      } else if (questionType === "MCQs") {
        return (
          <McqPracticePage
            questions={mcqs}
            onComplete={handlePracticeCompletion}
          />
        );
      }
    } else if (practiceType === "Simulated Exam Session") {
      if (questionType === "Descriptive Questions") {
        return (
          <SubjectiveExamPage
            questions={descriptives}
            difficulty={selectedDifficulty}
            onComplete={handlePracticeCompletion}
          />
        );
      } else if (questionType === "MCQs") {
        return (
          <McqExamPage
            questions={mcqs}
            difficulty={selectedDifficulty}
            onComplete={handlePracticeCompletion}
          />
        );
      }
    }
    return null;
  };

  return (
    <Box className="bg-white rounded min-h-full min-w-full my-2">
      <Container maxWidth="lg" className="pt-8 pb-8">
        <Typography
          variant="h4"
          align="center"
          className="text-blue-500 font-bold"
        >
          Exam Preparation
        </Typography>
        {showPracticePage ? (
          getPracticeComponent()
        ) : (
          <Grid container spacing={2} className="mt-8">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subject-select-label">Subject</InputLabel>
                <Select
                  labelId="subject-select-label"
                  value={selectedSubject}
                  label="Subject"
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedTopic("");
                  }}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl
                fullWidth
                variant="outlined"
                disabled={!selectedSubject}
              >
                <InputLabel id="topic-select-label">Topic</InputLabel>
                <Select
                  labelId="topic-select-label"
                  value={selectedTopic}
                  label="Topic"
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {topics.map((topic) => (
                    <MenuItem key={topic._id} value={topic._id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
                {!selectedSubject && (
                  <Typography color="error" variant="body2">
                    Please select a subject first.
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="question-select-label">
                  Question Type
                </InputLabel>
                <Select
                  labelId="question-select-label"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  label="Question Type"
                >
                  <MenuItem value="MCQs">MCQs</MenuItem>
                  <MenuItem value="Descriptive Questions">
                    Descriptive Questions
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-select-label"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  label="Difficulty"
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="number-select-label">
                  Number of Questions
                </InputLabel>
                <Select
                  labelId="number-select-label"
                  value={numberOfQuestions}
                  label="Number of Questions"
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                >
                  {noOfQues.map((number, index) => (
                    <MenuItem key={index} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="practice-select-label">
                  Practice Type
                </InputLabel>
                <Select
                  labelId="practice-select-label"
                  value={practiceType}
                  onChange={(e) => setPracticeType(e.target.value)}
                  label="Practice Type"
                >
                  <MenuItem value="Normal Non-Timed Constrained">
                    Normal Non-Timed Constrained
                  </MenuItem>
                  <MenuItem value="Simulated Exam Session">
                    Simulated Exam Session
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {errorMessage && (
          <Alert severity="error" className="mb-4">
            {errorMessage}
          </Alert>
        )}

        {!showPracticePage && (
          <Box className="flex justify-center mt-8">
            <Button
              variant="contained"
              color="primary"
              className="bg-blue-500 text-white"
              onClick={handleStartPractice}
            >
              Start Practice Session
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PreparationPage;
