import React, { useEffect, useState } from "react";
import UserReelsCard from "./UserReelsCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllReelsAction } from "../../redux/Reels/reels.action";
import { Button, CircularProgress, Dialog, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const Reels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reels, loading, error } = useSelector((state) => state.reels);
  const [selectedReel, setSelectedReel] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getAllReelsAction());
  }, [dispatch]);

  const handleAddReel = () => {
    navigate("/create-reel");
  };

  const handleReelClick = (reel) => {
    // Pause any currently playing videos in the grid
    const videos = document.querySelectorAll(".reel-card-video");
    videos.forEach((video) => {
      video.pause();
    });

    setSelectedReel(reel);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReel(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="outlined"
          onClick={() => dispatch(getAllReelsAction())}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reels</h1>
        <Button variant="contained" color="primary" onClick={handleAddReel}>
          Create Reel
        </Button>
      </div>

      {reels.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">No reels available</p>
          <Button variant="outlined" onClick={handleAddReel}>
            Create Your First Reel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => handleReelClick(reel)}
              className="cursor-pointer"
            >
              <UserReelsCard
                views={reel.views || 0}
                title={reel.title}
                isPinned={reel.isPinned || false}
                videoUrl={reel.video}
              />
            </div>
          ))}
        </div>
      )}

      {/* Zoom Modal for Selected Reel */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <div className="relative">
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedReel && (
            <div className="w-full" style={{ maxWidth: "600px" }}>
              <ZoomedReelView reel={selectedReel} />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

// Component for the zoomed reel view
const ZoomedReelView = ({ reel }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // This function will toggle play/pause when the video is clicked
  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent event bubbling

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.log("Play prevented:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        className="w-full aspect-[9/16] object-contain"
        controls={false}
        playsInline
        loop
      >
        <source src={reel.video} type="video/mp4" />
      </video>

      {/* Play/Pause Overlay */}
      <div
        className="absolute inset-0 z-1 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="p-4 bg-black/50 rounded-full">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Reel Info */}
      <div className="p-4 text-white bg-black">
        <h2 className="text-lg font-semibold">{reel.title}</h2>
        <div className="flex items-center mt-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span>{reel.views || 0} views</span>
        </div>
        {reel.user && (
          <p className="text-sm mt-2 text-gray-300">
            Posted by: @
            {reel.user.username ||
              `${reel.user.firstName?.toLowerCase()}_${reel.user.lastName?.toLowerCase()}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Reels;
