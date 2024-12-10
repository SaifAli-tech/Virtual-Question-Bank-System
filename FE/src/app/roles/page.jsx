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
import { AxiosError } from "axios";
import apiClient from "@/components/ApiClient";
import withAuth from "@/components/withAuth";

const pageNumbers = [5, 10, 15, 20];

const RoleList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");
  const urlRecords = searchParams.get("take");
  const urlOrder = searchParams.get("sort");
  const urlSearch = searchParams.get("search");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [page, setPage] = useState(Number(urlPage) || 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(urlRecords) || 10);
  const [sortDirection, setSortDirection] = useState(urlOrder || "ASC");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [deleteRoleName, setDeleteRoleName] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, sortDirection, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/roles/pagedata?page=${page}&take=${rowsPerPage}&order=${sortDirection}&search=${searchTerm}`
      );
      setRoles(response.data.pagedata);
      setCount(response.data.meta.pageCount);

      router.replace(
        `/roles?page=${page}&take=${rowsPerPage}&sort=${sortDirection}&search=${searchTerm}`
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  const deleteRole = async () => {
    if (deleteRoleId && deleteRoleName) {
      try {
        await apiClient.delete(`/roles/${deleteRoleId}`);
        Swal.fire({
          icon: "success",
          color: "green",
          title: "Success",
          text: `Role "${deleteRoleName}" deleted successfully.`,
        });
        fetchData();
        closeConfirmDialog();
      } catch (error) {
        if (error instanceof AxiosError) {
          Swal.fire({
            icon: "error",
            color: "red",
            title: "Oops...",
            text: error.response?.data.message || error.message,
          });
        }
        closeConfirmDialog();
      }
    }
  };

  const openConfirmDialog = (roleId, roleName) => {
    setDeleteRoleId(roleId);
    setDeleteRoleName(roleName);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDeleteRoleId(null);
    setDeleteRoleName(null);
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
        Role List
      </Typography>

      <Dialog open={!!selectedRole} onClose={() => setSelectedRole(null)}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          Role Details
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Role:</strong>
                </td>
                <td className="p-1">{selectedRole?.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Created At:</strong>
                </td>
                <td className="p-1">
                  {selectedRole?.createdAt
                    ? format(
                        new Date(selectedRole?.createdAt),
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
                  {selectedRole?.updatedAt
                    ? format(
                        new Date(selectedRole?.updatedAt),
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
            onClick={() => setSelectedRole(null)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">{`Delete Role "${deleteRoleName}"`}</DialogTitle>
        <DialogContent className="p-4">
          <DialogContentText className="font-bold mt-4 text-gray-700">
            Are you sure you want to permanently delete the role "
            {deleteRoleName}"?
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
            onClick={deleteRole}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/4"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => router.push("/roles/add")}
        >
          Add Role
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Typography className="ml-2">Loading...</Typography>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <Typography variant="h6" color="textSecondary">
            No roles found
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
                  Role{" "}
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
              {roles.map((role, index) => (
                <TableRow key={role._id}>
                  <TableCell className="font-bold text-base text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    {role.name}
                  </TableCell>
                  <TableCell className="font-bold text-base text-center">
                    <IconButton onClick={() => setSelectedRole(role)}>
                      <VisibilityIcon className="text-blue-500" />
                    </IconButton>
                    <IconButton
                      onClick={() => router.push(`/roles/edit/${role._id}`)}
                    >
                      <EditIcon className="text-green-500" />
                    </IconButton>
                    <IconButton
                      onClick={() => openConfirmDialog(role._id, role.name)}
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

export default withAuth(RoleList, ["Admin"]);
