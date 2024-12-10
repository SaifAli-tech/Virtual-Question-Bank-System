"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Pagination,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const pageNumbers = [5, 10, 15, 20];

const DescriptiveExamList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");
  const urlRecords = searchParams.get("take");
  const urlFilter = searchParams.get("filter");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [status, setStatus] = useState(urlFilter || "");
  const [page, setPage] = useState(Number(urlPage) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(urlRecords) || 10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/descriptiveExams/pagedata?page=${page}&take=${rowsPerPage}&filter=${status}`
      );
      setExams(response.data.pagedata);
      setCount(response.data.meta.pageCount);

      router.replace(
        `/descriptiveExams?page=${page}&take=${rowsPerPage}&filter=${status}`
      );
    } catch (error) {
      console.error("Error fetching exam records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRecordsPerPageChange = (event) => {
    const newRecords = parseInt(event.target.value, 10);
    setRowsPerPage(newRecords);
    setPage(1); // Reset to the first page
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 h-full">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="mb-4 text-blue-500 font-bold"
      >
        Descriptive Exam List
      </Typography>

      <Dialog
        open={selectedExam === null ? false : true}
        onClose={() => setSelectedExam(null)}
      >
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          Exam Details
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">
                  <strong>User:</strong>
                </td>
                <td className="p-1">{exams[selectedExam]?.user?.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Code:</strong>
                </td>
                <td className="p-1">{exams[selectedExam]?.user?.code}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Subject:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.questions[0]?.topic?.subject?.name}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Topic:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.questions[0]?.topic?.name}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Difficulty:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.questions[0]?.difficulty}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Questions:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.questions?.length}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Status:</strong>
                </td>
                <td className="p-1">{exams[selectedExam]?.status}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Total Score:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.totalScore
                    ? exams[selectedExam]?.totalScore
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Acquired Score:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.acquiredScores?.length > 0
                    ? exams[selectedExam]?.acquiredScores.reduce(
                        (total, score) => total + score,
                        0
                      )
                    : 0}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Checked At:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.checkedAt
                    ? format(
                        new Date(exams[selectedExam]?.checkedAt),
                        "dd-MMMM-yyyy hh:mm:ss aaa"
                      )
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Created At:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.createdAt
                    ? format(
                        new Date(exams[selectedExam]?.createdAt),
                        "dd-MMMM-yyyy hh:mm:ss aaa"
                      )
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Updated At:</strong>
                </td>
                <td className="p-1">
                  {exams[selectedExam]?.updatedAt
                    ? format(
                        new Date(exams[selectedExam]?.updatedAt),
                        "dd-MMMM-yyyy hh:mm:ss aaa"
                      )
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions className="flex items-center justify-center mb-2">
          <Button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-9 rounded-full"
            onClick={() => setSelectedExam(null)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-center items-center mb-4">
        <FormControl>
          <InputLabel id="filter-select-label">Status</InputLabel>
          <Select
            labelId="filter-select-label"
            value={status}
            label="Status"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-52"
          >
            <MenuItem value="">
              <em>Select Status</em>
            </MenuItem>
            <MenuItem value="Checked">Checked</MenuItem>
            <MenuItem value="Unchecked">Unchecked</MenuItem>
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Typography className="ml-2">Loading...</Typography>
        </div>
      ) : exams.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Typography variant="h6" color="textSecondary">
            No exam records found
          </Typography>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="w-full overflow-x-auto rounded-3xl"
        >
          <Table className="min-w-full border border-gray-300">
            <TableHead className="bg-blue-500">
              <TableRow>
                <TableCell className="font-bold text-center text-white text-lg">
                  #
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  User
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Subject
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Topic
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Difficulty
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Status
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam, index) => (
                <TableRow key={exam._id}>
                  <TableCell className="font-bold text-base text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {exam.user.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {exams[index].questions[0].topic.subject.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {exams[index].questions[index].topic.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {exams[index].questions[index].difficulty}
                  </TableCell>
                  <TableCell
                    className={`font-bold text-base text-center ${
                      exam.status === "Checked"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {exam.status}
                  </TableCell>

                  <TableCell className="font-bold text-base text-center">
                    <IconButton onClick={() => setSelectedExam(index)}>
                      <VisibilityIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        router.push(`/descriptiveExams/check/${exam._id}`)
                      }
                    >
                      <EditIcon className="text-green-500" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div className="flex m-4 justify-between">
        <div className="ml-5 text-black">
          <span>Records per page: </span>
          <Select
            variant="standard"
            disableUnderline={true}
            className="m-2 text-center w-15"
            value={rowsPerPage}
            onChange={handleRecordsPerPageChange}
            autoWidth
          >
            {pageNumbers.map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Pagination
          showFirstButton
          showLastButton
          count={count}
          page={page}
          onChange={handlePageChange}
          size="large"
          className="self-center"
        />
      </div>
    </div>
  );
};

export default withAuth(DescriptiveExamList, ["Admin", "Teacher"]);
