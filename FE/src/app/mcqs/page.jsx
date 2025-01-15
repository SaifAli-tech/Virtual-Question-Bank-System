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
  TextField,
  Button,
  Pagination,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";
import { useSession } from "next-auth/react";

const pageNumbers = [5, 10, 15, 20];

const McqsList = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.name;
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");
  const urlRecords = searchParams.get("take");
  const urlSearch = searchParams.get("search");
  const urlFilter = searchParams.get("filter");
  const urlDifficulty = searchParams.get("difficulty");
  const [mcqs, setMcqs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedMcq, setSelectedMcq] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(urlFilter || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    urlDifficulty || ""
  );
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [page, setPage] = useState(Number(urlPage) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(urlRecords) || 10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteMcqId, setDeleteMcqId] = useState(null);
  const [deleteMcqText, setDeleteMcqText] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchTerm, selectedTopic, selectedDifficulty]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/mcqs/pagedata?page=${page}&take=${rowsPerPage}&search=${searchTerm}&filter=${selectedTopic}&difficulty=${selectedDifficulty}`
      );
      setMcqs(response.data.pagedata);
      setCount(response.data.meta.pageCount);

      router.replace(
        `/mcqs?page=${page}&take=${rowsPerPage}&search=${searchTerm}&filter=${selectedTopic}&difficulty=${selectedDifficulty}`
      );
    } catch (error) {
      console.error("Error fetching mcqs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const topicRecords = await apiClient.get("/topics");
      setTopics(topicRecords.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(1); // Reset to page 1 on new search
  };

  const handleRecordsPerPageChange = (event) => {
    const newRecords = parseInt(event.target.value, 10);
    setRowsPerPage(newRecords);
    setPage(1); // Reset to the first page
  };

  const deleteMcq = async () => {
    if (deleteMcqId && deleteMcqText) {
      try {
        await apiClient.delete(`/mcqs/${deleteMcqId}`);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Mcq "${deleteMcqText}" deleted successfully.`,
        });
        fetchData();
        closeConfirmDialog();
      } catch (error) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: `Error deleting mcq "${deleteMcqText}".`,
        });
        closeConfirmDialog();
      }
    }
  };

  const openConfirmDialog = (mcqId, mcqText) => {
    setDeleteMcqId(mcqId);
    setDeleteMcqText(mcqText);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDeleteMcqId(null);
    setDeleteMcqText(null);
    setConfirmDialogOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 h-full">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="mb-4 text-blue-500 font-bold"
      >
        MCQs List
      </Typography>

      <Dialog open={!!selectedMcq} onClose={() => setSelectedMcq(null)}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          Mcq Details
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Mcq:</strong>
                </td>
                <td className="p-1">{selectedMcq?.text}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Answer:</strong>
                </td>
                <td className="p-1">{selectedMcq?.answer}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Options:</strong>
                </td>
                <td className="p-1">
                  {selectedMcq?.options.length !== 0
                    ? selectedMcq?.options.map((option, index) => (
                        <span key={index}>
                          {option}
                          {index < selectedMcq.options.length - 1 && (
                            <>
                              , <br />
                            </>
                          )}
                        </span>
                      ))
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Subject:</strong>
                </td>
                <td className="p-1">{selectedMcq?.topic.subject.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Topic:</strong>
                </td>
                <td className="p-1">{selectedMcq?.topic.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Difficulty:</strong>
                </td>
                <td className="p-1">{selectedMcq?.difficulty}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Created At:</strong>
                </td>
                <td className="p-1 align-top">
                  {selectedMcq?.createdAt
                    ? format(
                        new Date(selectedMcq?.createdAt),
                        "dd-MMMM-yyyy hh:mm:ss aaa"
                      )
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Updated At:</strong>
                </td>
                <td className="p-1 align-top">
                  {selectedMcq?.updatedAt
                    ? format(
                        new Date(selectedMcq?.updatedAt),
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
            onClick={() => setSelectedMcq(null)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">{`Delete Mcq "${deleteMcqText}"`}</DialogTitle>
        <DialogContent className="p-4">
          <DialogContentText className="font-bold mt-4 text-gray-700">
            Are you sure you want to permanently delete the mcq "{deleteMcqText}
            "?
            <p className="text-red-500">
              <b>Note:</b> This action is irreversible.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex items-center justify-center m-2 pb-4">
          <Button
            className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-8 rounded-full"
            onClick={closeConfirmDialog}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-9 rounded-full"
            onClick={deleteMcq}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search mcqs..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/4"
        />
        <FormControl>
          <InputLabel id="filter-select-label">Topic</InputLabel>
          <Select
            labelId="filter-select-label"
            value={selectedTopic}
            label="Topic"
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setPage(1);
            }}
            className="w-52"
          >
            <MenuItem value="">
              <em>Select Topic</em>
            </MenuItem>
            {topics.map((topic) => (
              <MenuItem key={topic._id} value={topic._id}>
                {topic.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="filter-select-label">Difficulty</InputLabel>
          <Select
            labelId="filter-select-label"
            value={selectedDifficulty}
            label="Difficulty"
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
            className="w-52"
          >
            <MenuItem value="">
              <em>Select Difficulty</em>
            </MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
        {userRole !== "Student" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => router.push("/mcqs/add")}
          >
            Add Mcq
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Typography className="ml-2">Loading...</Typography>
        </div>
      ) : mcqs.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Typography variant="h6" color="textSecondary">
            No mcqs found
          </Typography>
        </div>
      ) : (
        <TableContainer component={Paper} className="w-full rounded-3xl">
          <Table className="min-w-full border border-gray-300">
            <TableHead className="bg-blue-500">
              <TableRow>
                <TableCell className="font-bold text-center text-white text-lg">
                  #
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg w-1/3">
                  Mcq
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mcqs.map((mcq, index) => (
                <TableRow key={mcq._id}>
                  <TableCell className="font-bold text-base text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center w-1/3">
                    {mcq.text}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {mcq.topic.subject.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {mcq.topic.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {mcq.difficulty}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    <IconButton onClick={() => setSelectedMcq(mcq)}>
                      <VisibilityIcon className="text-blue-500" />
                    </IconButton>
                    {userRole !== "Student" && (
                      <IconButton
                        onClick={() => router.push(`/mcqs/edit/${mcq._id}`)}
                      >
                        <EditIcon className="text-green-500" />
                      </IconButton>
                    )}
                    {userRole === "Admin" && (
                      <IconButton
                        onClick={() => openConfirmDialog(mcq._id, mcq.text)}
                      >
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                    )}
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

export default withAuth(McqsList, ["Admin", "Teacher", "Student"]);
