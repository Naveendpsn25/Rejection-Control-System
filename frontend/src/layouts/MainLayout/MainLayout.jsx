import { Outlet } from "react-router-dom";

import Header from "./Header";
import Navbar from "./Navbar";

import { Box } from "@mui/material";

const MainLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#eef2f6",
      }}
    >
      <Header />

      <Navbar />

      <Box
        sx={{
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;