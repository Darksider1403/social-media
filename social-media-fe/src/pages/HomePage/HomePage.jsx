import Box from "@mui/material/Box";
import React from "react";
import Profile from "../Profile/Profile";
import Sidebar from "../../Component/Sidebar/Sidebar";
import MiddlePart from "../../Component/MiddlePart/MiddlePart";
import Reels from "../../Component/Reels/Reels";
import CreateReelsForm from "../../Component/Reels/CreateReelsForm";
import { useLocation, Routes, Route } from "react-router-dom";
import HomeRight from "../../Component/HomeRight/HomeRight";

const HomePage = () => {
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="row" width="100vw" height="100vh">
      {/* Sidebar */}
      <Box sx={{ width: { xs: "0%%", lg: "25%" } }}>
        <Sidebar />
      </Box>

      {/* Middle Part */}
      <Box
        sx={{
          width: {
            xs: "100%",
            lg: location.pathname === "/home" ? "50%" : "75%",
          },
          px: 2,
          ml: { xs: 0, lg: "25%" }, // Add margin-left equal to sidebar width
        }}
      >
        <Routes>
          <Route path="/" element={<MiddlePart />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/create-reels" element={<CreateReelsForm />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </Box>

      {/* HomeRight */}
      {location.pathname === "/home" && (
        <Box
          sx={{
            width: { lg: "25%" },
            display: { xs: "none", lg: "block" },
          }}
          className="sticky top-0"
        >
          <HomeRight />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
