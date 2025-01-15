"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Menu as MenuIcon, ChevronLeft } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const SidebarLayout = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const isLoggedIn = Boolean(session);
  const userRole = session?.user?.role?.name || "";

  const handleLogout = () => {
    signOut({ callbackUrl: "http://localhost:4000/login" });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
    handleMenuClose(); // Close the dropdown menu
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  const menuItems = [
    { text: "Home", href: "/", roles: ["Admin", "Teacher", "Student"] },
    { text: "Users List", href: "/users", roles: ["Admin"] },
    { text: "Roles List", href: "/roles", roles: ["Admin"] },
    {
      text: "Subjects List",
      href: "/subjects",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "Topics List",
      href: "/topics",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "Descriptive Questions List",
      href: "/descriptives",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "MCQs List",
      href: "/mcqs",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "Exam Preparation",
      href: "/preparation",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "MCQ Exams List",
      href: "/mcqExams",
      roles: ["Admin", "Teacher"],
    },
    {
      text: "Descriptive Exams List",
      href: "/descriptiveExams",
      roles: ["Admin", "Teacher"],
    },
    {
      text: "Analytics",
      href: "/analytics",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "Support",
      href: "/support",
      roles: ["Student"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "#1976d2",
          padding: 1.5,
          color: "white",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            paddingLeft: 0.6,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Menu
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
          <ChevronLeft />
        </IconButton>
      </Box>
      <List disablePadding>
        {filteredMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <AppBar position="fixed">
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Virtual Question Bank System
          </Typography>
          {!isLoggedIn ? (
            <>
              <Button
                color="inherit"
                onClick={() => router.push("/login")}
                className="text-base font-medium"
              >
                Login
              </Button>
              <Button
                color="inherit"
                href="/signup"
                className="text-base font-medium"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => router.push("/notifications")}
                className="text-base font-medium"
              >
                Notifications
              </Button>
              <Button
                color="inherit"
                onClick={handleMenuClick}
                className="text-base font-medium"
              >
                {session.user.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleInfoDialogOpen}>
                  Personal Information
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    router.push(`/updateProfile/${session.user._id}`)
                  }
                >
                  Update Profile
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    router.push(`/changePassword/${session.user._id}`)
                  }
                >
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {isLoggedIn && (
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      )}

      <Dialog open={infoDialogOpen} onClose={handleInfoDialogClose}>
        <DialogTitle className="text-center bg-blue-500 text-white font-bold  m-2 rounded-lg py-3">
          Personal Information
        </DialogTitle>
        <DialogContent className="text-lg px-6 py-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Name:</strong>
                </td>
                <td className="p-1">{session?.user?.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Email:</strong>
                </td>
                <td className="p-1">{session?.user?.email}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Phone:</strong>
                </td>
                <td className="p-1">{session?.user?.phone}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Code:</strong>
                </td>
                <td className="p-1">{session?.user?.code}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">
                  <strong>Role:</strong>
                </td>
                <td className="p-1">{userRole}</td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions className="flex items-center justify-center mb-2">
          <Button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-9 rounded-full"
            onClick={handleInfoDialogClose}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: "64px", // This ensures content starts below the AppBar
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e0e0e0",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
