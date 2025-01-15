"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";
import { useSession } from "next-auth/react";

const AnalyticsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.name;
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [analyticsData, setAnalyticsData] = useState({
    descriptive: { analytics: [], averageTimeTaken: 0 },
    mcq: { analytics: [], averageTimeTaken: 0 },
  });
  const [selectedType, setSelectedType] = useState("descriptive");

  useEffect(() => {
    fetchAnalyticsData();
  }, [searchTerm]);

  const fetchAnalyticsData = async () => {
    try {
      const fetchCode = searchTerm || session?.user?.code || "";
      const response = await apiClient.get(`/analytics?search=${fetchCode}`);
      setAnalyticsData(response.data);
      router.replace(`/analytics?search=${fetchCode}`);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const renderTopicAnalytics = (topics) => {
    if (!topics || topics.length === 0) {
      return (
        <Typography className="text-center text-gray-500">
          No analytics data available.
        </Typography>
      );
    }
    return topics.map((topic, index) => (
      <Card key={index} className="mb-4 shadow">
        <CardContent>
          <Typography variant="h6" className="font-bold">
            Topic: {topic.topic} | Subject: {topic.subject}
          </Typography>
          <Typography variant="body2" className="mt-2">
            Difficulty:
          </Typography>
          <ul className="list-disc pl-6">
            <li>Easy: {topic.difficulty.Easy || 0}</li>
            <li>Medium: {topic.difficulty.Medium || 0}</li>
            <li>Hard: {topic.difficulty.Hard || 0}</li>
          </ul>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="p-6 w-4/5 bg-gray-100 rounded-lg">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="text-blue-500 mb-6 font-bold"
      >
        Analytics
      </Typography>

      {userRole !== "Student" && (
        <Box className="flex justify-center mb-6">
          <TextField
            placeholder="Enter code..."
            variant="outlined"
            className="mr-4 w-1/4 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

      <Box className="flex justify-center mb-6">
        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={(e, newType) => setSelectedType(newType)}
        >
          <ToggleButton value="descriptive">Descriptive Analytics</ToggleButton>
          <ToggleButton value="mcq">MCQ Analytics</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Typography variant="h6" align="center" className="text-gray-700 mb-4">
        Average Time Taken:{" "}
        {selectedType === "descriptive"
          ? `${analyticsData.descriptive?.averageTimeTaken || 0} seconds`
          : `${analyticsData.mcq?.averageTimeTaken || 0} seconds`}
      </Typography>

      <Box className="bg-white p-4 rounded-lg shadow-lg">
        <Typography variant="h5" className="font-bold text-center mb-4">
          {selectedType === "descriptive"
            ? "Descriptive Exam Analytics"
            : "MCQ Analytics"}
        </Typography>

        {renderTopicAnalytics(
          selectedType === "descriptive"
            ? analyticsData.descriptive?.analytics
            : analyticsData.mcq?.analytics
        )}
      </Box>
    </div>
  );
};

export default withAuth(AnalyticsPage, ["Admin", "Teacher", "Student"]);
