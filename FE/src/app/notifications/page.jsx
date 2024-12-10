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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";
import { useSession } from "next-auth/react";

const pageNumbers = [5, 10, 15, 20];

const NotificationList = () => {
  const router = useRouter();
  const { session } = useSession();
  const userRole = session.user.role.name;
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");
  const urlRecords = searchParams.get("take");
  const urlOrder = searchParams.get("sort");
  const urlSearch = searchParams.get("search");
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [page, setPage] = useState(Number(urlPage) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(urlRecords) || 10);
  const [sortDirection, setSortDirection] = useState(urlOrder || "ASC");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState(null);
  const [deleteNotificationTitle, setDeleteNotificationTitle] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, sortDirection, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/notifications/pagedata?page=${page}&take=${rowsPerPage}&order=${sortDirection}&search=${searchTerm}`
      );
      setNotifications(response.data.pagedata);
      setCount(response.data.meta.pageCount);

      router.replace(
        `/notifications?page=${page}&take=${rowsPerPage}&sort=${sortDirection}&search=${searchTerm}`
      );
    } catch (error) {
      console.error("Error fetching Notifications:", error);
    } finally {
      setLoading(false);
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

  const deleteNotification = async () => {
    if (deleteNotificationId && deleteNotificationTitle) {
      try {
        await apiClient.delete(`/notifications/${deleteNotificationId}`);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Notification "${deleteNotificationTitle}" deleted successfully.`,
        });
        fetchData();
        closeConfirmDialog();
      } catch (error) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: `Error deleting notification "${deleteNotificationTitle}".`,
        });
        closeConfirmDialog();
      }
    }
  };

  const openConfirmDialog = (NotificationId, NotificationTitle) => {
    setDeleteNotificationId(NotificationId);
    setDeleteNotificationTitle(NotificationTitle);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDeleteNotificationId(null);
    setDeleteNotificationTitle(null);
    setConfirmDialogOpen(false);
  };

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "ASC" ? "DESC" : "ASC"
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="mb-4 text-blue-500 font-bold"
      >
        Notification List
      </Typography>

      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          Notification Details
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Title:</strong>
                </td>
                <td className="p-1">{selectedNotification?.title}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Text:</strong>
                </td>
                <td className="p-1">{selectedNotification?.text}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Created At:</strong>
                </td>
                <td className="p-1">
                  {selectedNotification?.createdAt
                    ? format(
                        new Date(selectedNotification?.createdAt),
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
                  {selectedNotification?.updatedAt
                    ? format(
                        new Date(selectedNotification?.updatedAt),
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
            onClick={() => setSelectedNotification(null)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">{`Delete Notification "${deleteNotificationTitle}"`}</DialogTitle>
        <DialogContent className="p-4">
          <DialogContentText className="font-bold mt-4 text-gray-700">
            Are you sure you want to permanently delete the notification "
            {deleteNotificationTitle}"?
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
            onClick={deleteNotification}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3"
        />
        {userRole === "Admin" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => router.push("/notifications/add")}
          >
            Add Notification
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Typography className="ml-2">Loading...</Typography>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Typography variant="h6" color="textSecondary">
            No notifications found
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
                  Title
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Date{" "}
                  <IconButton onClick={toggleSortDirection}>
                    <SortByAlphaIcon />
                  </IconButton>
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={notification._id}>
                  <TableCell className="font-bold text-base text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {notification.title}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {format(
                      new Date(notification?.createdAt),
                      "dd-MMMM-yyyy hh:mm:ss aaa"
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    <IconButton
                      onClick={() => setSelectedNotification(notification)}
                    >
                      <VisibilityIcon className="text-blue-500" />
                    </IconButton>
                    {userRole === "Admin" && (
                      <IconButton
                        onClick={() =>
                          router.push(`/notifications/edit/${notification._id}`)
                        }
                      >
                        <EditIcon className="text-green-500" />
                      </IconButton>
                    )}
                    {userRole === "Admin" && (
                      <IconButton
                        onClick={() =>
                          openConfirmDialog(
                            notification._id,
                            notification.title
                          )
                        }
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

      <div className="flex mt-6 mb-6 pb-4 mx-4 justify-between">
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

export default withAuth(NotificationList, ["Admin", "Teacher", "Student"]);
