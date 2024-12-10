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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const pageNumbers = [5, 10, 15, 20];

const UserList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");
  const urlRecords = searchParams.get("take");
  const urlOrder = searchParams.get("sort");
  const urlSearch = searchParams.get("search");
  const urlFilter = searchParams.get("filter");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(urlFilter || "");
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [page, setPage] = useState(Number(urlPage) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(urlRecords) || 10);
  const [sortDirection, setSortDirection] = useState(urlOrder || "ASC");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, sortDirection, searchTerm, selectedRole]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/users/pagedata?page=${page}&take=${rowsPerPage}&order=${sortDirection}&search=${searchTerm}&filter=${selectedRole}`
      );
      setUsers(response.data.pagedata);
      setCount(response.data.meta.pageCount);

      router.replace(
        `/users?page=${page}&take=${rowsPerPage}&sort=${sortDirection}&search=${searchTerm}&filter=${selectedRole}`
      );
    } catch (error) {
      console.error("Error fetching Users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const roleRecords = await apiClient.get("/roles");
      setRoles(roleRecords.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  const deleteUser = async () => {
    if (deleteUserId && deleteUserName) {
      try {
        await apiClient.delete(`/users/${deleteUserId}`);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `User "${deleteUserName}" deleted successfully.`,
        });
        fetchData();
        closeConfirmDialog();
      } catch (error) {
        Swal.fire({
          icon: "error",
          color: "red",
          title: "Oops...",
          text: `Error deleting user "${deleteUserName}".`,
        });
        closeConfirmDialog();
      }
    }
  };

  const openConfirmDialog = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDeleteUserId(null);
    setDeleteUserName(null);
    setConfirmDialogOpen(false);
  };

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "ASC" ? "DESC" : "ASC"
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 h-full">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="mb-4 text-blue-500 font-bold"
      >
        User List
      </Typography>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          User Details
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Name:</strong>
                </td>
                <td className="p-1">{selectedUser?.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Email:</strong>
                </td>
                <td className="p-1">{selectedUser?.email}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Phone:</strong>
                </td>
                <td className="p-1">{selectedUser?.phone}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Code:</strong>
                </td>
                <td className="p-1">{selectedUser?.code}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 align-top">
                  <strong>Role:</strong>
                </td>
                <td className="p-1">
                  {selectedUser?.role ? selectedUser?.role.name : "-"}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Created At:</strong>
                </td>
                <td className="p-1">
                  {selectedUser?.createdAt
                    ? format(
                        new Date(selectedUser?.createdAt),
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
                  {selectedUser?.updatedAt
                    ? format(
                        new Date(selectedUser?.updatedAt),
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
            onClick={() => setSelectedUser(null)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">{`Delete User "${deleteUserName}"`}</DialogTitle>
        <DialogContent className="p-4">
          <DialogContentText className="font-bold mt-4 text-gray-700">
            Are you sure you want to permanently delete the user "
            {deleteUserName}"?
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
            onClick={deleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/4"
        />
        <FormControl>
          <InputLabel id="filter-select-label">Role</InputLabel>
          <Select
            labelId="filter-select-label"
            value={selectedRole}
            label="Role"
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
            className="w-52"
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => router.push("/users/add")}
        >
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Typography className="ml-2">Loading...</Typography>
        </div>
      ) : users.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Typography variant="h6" color="textSecondary">
            No users found
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
                  Name{" "}
                  <IconButton onClick={toggleSortDirection}>
                    <SortByAlphaIcon />
                  </IconButton>
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Email
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Phone
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Role
                </TableCell>
                <TableCell className="font-bold text-center text-white text-lg">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell className="font-bold text-base text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {user.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {user.phone}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {user.role ? user.role.name : "-"}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    <IconButton onClick={() => setSelectedUser(user)}>
                      <VisibilityIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton
                      onClick={() => router.push(`/users/edit/${user._id}`)}
                    >
                      <EditIcon className="text-green-500" />
                    </IconButton>
                    <IconButton
                      onClick={() => openConfirmDialog(user._id, user.name)}
                    >
                      <DeleteIcon className="text-red-500" />
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

export default withAuth(UserList, ["Admin"]);
